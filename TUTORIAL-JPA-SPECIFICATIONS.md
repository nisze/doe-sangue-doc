# 🔍 Tutorial Completo - JPA Specifications para Filtros Dinâmicos

**Finalidade:** Guia prático para implementar filtros dinâmicos usando JPA Specifications  
**Foco:** Implementação do filtro `DoadorRequestFilterDTO` com Specifications  
**Tecnologia:** Spring Data JPA, Criteria API

---

## 🎯 Objetivo deste Tutorial

Este tutorial ensina como implementar **filtros dinâmicos** usando **JPA Specifications**, permitindo consultas flexíveis e eficientes baseadas nos campos do `DoadorRequestFilterDTO`.

### **✅ O que você vai aprender:**
- Configurar JPA Specifications no projeto
- Criar Specifications customizadas para cada campo
- Implementar Repository com filtros dinâmicos
- Usar no Controller com paginação
- Otimizar consultas com Criteria API

---

## 🏗️ Estrutura da Implementação

### **📊 Seu DTO Atual:**
```java
public record DoadorRequestFilterDTO(
    String cpf,
    String fullName,
    String email,
    String telefonePrincipal,
    String tipoSanguineo,
    String cidade,
    String estado,
    String empresa,
    String pesoKg,
    String doadorHabitual
) {}
```

### **🎯 Resultado Final:**
- ✅ Filtros opcionais (só aplica se não for null/vazio)
- ✅ Busca parcial para texto (LIKE)
- ✅ Paginação integrada
- ✅ Performance otimizada
- ✅ Type safety completo

---

## 📋 Passo 1: Configuração do Repository

### **🔧 Atualizar DoadorRepository**

```java
package com.faculdade.doesangue_api.repository;

import com.faculdade.doesangue_api.entities.Doador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DoadorRepository extends 
    JpaRepository<Doador, Long>, 
    JpaSpecificationExecutor<Doador> {  // 👈 Interface necessária para Specifications
    
    // Métodos existentes permanecem...
    
    // Método opcional para busca com Specification customizada
    default Page<Doador> findWithFilters(Specification<Doador> spec, Pageable pageable) {
        return findAll(spec, pageable);
    }
}
```

---

## 📋 Passo 2: Criar a Classe de Specifications

### **🔨 DoadorSpecifications.java**

```java
package com.faculdade.doesangue_api.specifications;

import com.faculdade.doesangue_api.dto.doador.DoadorRequestFilterDTO;
import com.faculdade.doesangue_api.entities.Doador;
import com.faculdade.doesangue_api.entities.TipoSanguineo;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DoadorSpecifications {

    /**
     * 🎯 Método principal - Constrói Specification baseada no FilterDTO
     */
    public static Specification<Doador> withFilters(DoadorRequestFilterDTO filters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 📄 Filtro por CPF (busca exata)
            if (StringUtils.hasText(filters.cpf())) {
                predicates.add(
                    criteriaBuilder.equal(
                        root.get("cpf"), 
                        filters.cpf().replaceAll("[^0-9]", "") // Remove formatação
                    )
                );
            }

            // 👤 Filtro por Nome (busca parcial - LIKE)
            if (StringUtils.hasText(filters.fullName())) {
                predicates.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("fullName")),
                        "%" + filters.fullName().toLowerCase() + "%"
                    )
                );
            }

            // 📧 Filtro por Email (busca parcial)
            if (StringUtils.hasText(filters.email())) {
                predicates.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + filters.email().toLowerCase() + "%"
                    )
                );
            }

            // 📞 Filtro por Telefone (busca parcial)
            if (StringUtils.hasText(filters.telefonePrincipal())) {
                predicates.add(
                    criteriaBuilder.like(
                        root.get("telefonePrincipal"),
                        "%" + filters.telefonePrincipal().replaceAll("[^0-9]", "") + "%"
                    )
                );
            }

            // 🩸 Filtro por Tipo Sanguíneo (JOIN com entidade relacionada)
            if (StringUtils.hasText(filters.tipoSanguineo())) {
                Join<Doador, TipoSanguineo> tipoSanguineoJoin = 
                    root.join("tipoSanguineo", JoinType.LEFT);
                
                predicates.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(
                            criteriaBuilder.concat(
                                tipoSanguineoJoin.get("tipoAbo"),
                                tipoSanguineoJoin.get("fatorRh")
                            )
                        ),
                        "%" + filters.tipoSanguineo().toLowerCase() + "%"
                    )
                );
            }

            // 🏙️ Filtro por Cidade (busca parcial)
            if (StringUtils.hasText(filters.cidade())) {
                predicates.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("cidade")),
                        "%" + filters.cidade().toLowerCase() + "%"
                    )
                );
            }

            // 🗺️ Filtro por Estado (busca exata)
            if (StringUtils.hasText(filters.estado())) {
                predicates.add(
                    criteriaBuilder.equal(
                        criteriaBuilder.upper(root.get("estado")),
                        filters.estado().toUpperCase()
                    )
                );
            }

            // 🏢 Filtro por Empresa (busca parcial)
            if (StringUtils.hasText(filters.empresa())) {
                predicates.add(
                    criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("empresa")),
                        "%" + filters.empresa().toLowerCase() + "%"
                    )
                );
            }

            // ⚖️ Filtro por Peso (range - maior ou igual)
            if (StringUtils.hasText(filters.pesoKg())) {
                try {
                    BigDecimal peso = new BigDecimal(filters.pesoKg());
                    predicates.add(
                        criteriaBuilder.greaterThanOrEqualTo(
                            root.get("pesoKg"), 
                            peso
                        )
                    );
                } catch (NumberFormatException e) {
                    // Ignora se não for um número válido
                }
            }

            // 🔄 Filtro por Doador Habitual (boolean)
            if (StringUtils.hasText(filters.doadorHabitual())) {
                Boolean isHabitual = Boolean.parseBoolean(filters.doadorHabitual());
                predicates.add(
                    criteriaBuilder.equal(
                        root.get("doadorHabitual"), 
                        isHabitual
                    )
                );
            }

            // 🚫 Sempre excluir registros deletados (soft delete)
            predicates.add(
                criteriaBuilder.isNull(root.get("deletedAt"))
            );

            // ✅ Combina todos os predicates com AND
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * 🔍 Specifications individuais para casos específicos
     */
    
    public static Specification<Doador> hasCpf(String cpf) {
        return (root, query, criteriaBuilder) -> 
            StringUtils.hasText(cpf) 
                ? criteriaBuilder.equal(root.get("cpf"), cpf.replaceAll("[^0-9]", ""))
                : criteriaBuilder.conjunction();
    }

    public static Specification<Doador> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> 
            StringUtils.hasText(name)
                ? criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("fullName")),
                    "%" + name.toLowerCase() + "%"
                )
                : criteriaBuilder.conjunction();
    }

    public static Specification<Doador> hasEmailLike(String email) {
        return (root, query, criteriaBuilder) -> 
            StringUtils.hasText(email)
                ? criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    "%" + email.toLowerCase() + "%"
                )
                : criteriaBuilder.conjunction();
    }

    public static Specification<Doador> isActive() {
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.isNull(root.get("deletedAt"));
    }

    public static Specification<Doador> inCity(String cidade) {
        return (root, query, criteriaBuilder) -> 
            StringUtils.hasText(cidade)
                ? criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("cidade")),
                    "%" + cidade.toLowerCase() + "%"
                )
                : criteriaBuilder.conjunction();
    }

    public static Specification<Doador> inState(String estado) {
        return (root, query, criteriaBuilder) -> 
            StringUtils.hasText(estado)
                ? criteriaBuilder.equal(
                    criteriaBuilder.upper(root.get("estado")),
                    estado.toUpperCase()
                )
                : criteriaBuilder.conjunction();
    }
}
```

---

## 📋 Passo 3: Atualizar o Service

### **🔧 DoadorService.java**

```java
package com.faculdade.doesangue_api.service;

import com.faculdade.doesangue_api.dto.doador.DoadorRequestFilterDTO;
import com.faculdade.doesangue_api.entities.Doador;
import com.faculdade.doesangue_api.repository.DoadorRepository;
import com.faculdade.doesangue_api.specifications.DoadorSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DoadorService {

    private final DoadorRepository doadorRepository;

    public DoadorService(DoadorRepository doadorRepository) {
        this.doadorRepository = doadorRepository;
    }

    /**
     * 🔍 Busca com filtros dinâmicos usando Specifications
     * 
     * @param filters - DTO com filtros opcionais
     * @param pageable - Configuração de paginação
     * @return Page<Doador> - Resultados paginados
     */
    public Page<Doador> buscarComFiltros(DoadorRequestFilterDTO filters, Pageable pageable) {
        Specification<Doador> spec = DoadorSpecifications.withFilters(filters);
        return doadorRepository.findAll(spec, pageable);
    }

    /**
     * 🎯 Busca usando Specifications compostas (exemplo avançado)
     */
    public Page<Doador> buscarDoadoresAtivosNaCidade(String cidade, Pageable pageable) {
        Specification<Doador> spec = Specification
            .where(DoadorSpecifications.isActive())
            .and(DoadorSpecifications.inCity(cidade));
            
        return doadorRepository.findAll(spec, pageable);
    }

    /**
     * 📊 Exemplo de combinação de Specifications
     */
    public Page<Doador> buscarDoadoresComCriterios(
            String nome, 
            String cidade, 
            String estado, 
            Pageable pageable) {
        
        Specification<Doador> spec = Specification
            .where(DoadorSpecifications.isActive())
            .and(DoadorSpecifications.hasNameLike(nome))
            .and(DoadorSpecifications.inCity(cidade))
            .and(DoadorSpecifications.inState(estado));
            
        return doadorRepository.findAll(spec, pageable);
    }

    // Outros métodos existentes...
}
```

---

## 📋 Passo 4: Atualizar o Controller

### **🎮 DoadorController.java**

```java
package com.faculdade.doesangue_api.controller;

import com.faculdade.doesangue_api.dto.doador.DoadorRequestFilterDTO;
import com.faculdade.doesangue_api.dto.doador.DoadorDTO;
import com.faculdade.doesangue_api.entities.Doador;
import com.faculdade.doesangue_api.service.DoadorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doadores")
@Tag(name = "Doadores", description = "API para gerenciamento de doadores de sangue")
@Validated
public class DoadorController {

    private final DoadorService doadorService;
    private final DoadorMapper doadorMapper;

    public DoadorController(DoadorService doadorService, DoadorMapper doadorMapper) {
        this.doadorService = doadorService;
        this.doadorMapper = doadorMapper;
    }

    /**
     * 🔍 Endpoint principal com filtros dinâmicos
     */
    @GetMapping
    @Operation(
        summary = "🔍 Listar doadores com filtros dinâmicos",
        description = """
            Lista doadores com filtros opcionais usando JPA Specifications.
            
            **Funcionalidades:**
            - ✅ Todos os filtros são opcionais
            - ✅ Busca parcial para texto (nome, email, cidade)
            - ✅ Busca exata para CPF e estado
            - ✅ Filtro por peso mínimo
            - ✅ Paginação e ordenação
            - ✅ Performance otimizada
            
            **Exemplos de uso:**
            - `GET /api/doadores?fullName=João&cidade=São Paulo&page=0&size=10`
            - `GET /api/doadores?tipoSanguineo=O+&doadorHabitual=true`
            - `GET /api/doadores?estado=SP&pesoKg=60&sort=fullName,asc`
            """
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "✅ Lista retornada com sucesso"),
        @ApiResponse(responseCode = "400", description = "❌ Parâmetros inválidos")
    })
    public ResponseEntity<Page<DoadorDTO>> listarComFiltros(
            
            @Parameter(description = "CPF para busca exata (apenas números)")
            @RequestParam(required = false) String cpf,
            
            @Parameter(description = "Nome completo para busca parcial")
            @RequestParam(required = false) String fullName,
            
            @Parameter(description = "Email para busca parcial")
            @RequestParam(required = false) String email,
            
            @Parameter(description = "Telefone para busca parcial")
            @RequestParam(required = false) String telefonePrincipal,
            
            @Parameter(description = "Tipo sanguíneo (ex: O+, A-, AB+)")
            @RequestParam(required = false) String tipoSanguineo,
            
            @Parameter(description = "Cidade para busca parcial")
            @RequestParam(required = false) String cidade,
            
            @Parameter(description = "Estado (UF - 2 caracteres)")
            @RequestParam(required = false) String estado,
            
            @Parameter(description = "Empresa para busca parcial")
            @RequestParam(required = false) String empresa,
            
            @Parameter(description = "Peso mínimo em kg")
            @RequestParam(required = false) String pesoKg,
            
            @Parameter(description = "Filtrar doadores habituais (true/false)")
            @RequestParam(required = false) String doadorHabitual,
            
            @Parameter(description = "Número da página (0-based)")
            @RequestParam(defaultValue = "0") @Min(0) int page,
            
            @Parameter(description = "Tamanho da página")
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
            
            @Parameter(description = "Campo para ordenação")
            @RequestParam(defaultValue = "fullName") String sort,
            
            @Parameter(description = "Direção da ordenação (asc/desc)")
            @RequestParam(defaultValue = "asc") String direction
    ) {
        
        // 📊 Criar DTO de filtros
        DoadorRequestFilterDTO filters = new DoadorRequestFilterDTO(
            cpf, fullName, email, telefonePrincipal, tipoSanguineo,
            cidade, estado, empresa, pesoKg, doadorHabitual
        );
        
        // 📄 Configurar paginação e ordenação
        Sort.Direction sortDirection = "desc".equalsIgnoreCase(direction) 
            ? Sort.Direction.DESC 
            : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        // 🔍 Executar busca com filtros
        Page<Doador> doadoresPage = doadorService.buscarComFiltros(filters, pageable);
        
        // 🔄 Converter para DTO
        Page<DoadorDTO> doadoresDTO = doadoresPage.map(doadorMapper::toDTO);
        
        return ResponseEntity.ok(doadoresDTO);
    }

    /**
     * 🎯 Endpoint específico para busca por cidade (exemplo simples)
     */
    @GetMapping("/por-cidade/{cidade}")
    @Operation(summary = "Buscar doadores ativos por cidade")
    public ResponseEntity<Page<DoadorDTO>> buscarPorCidade(
            @PathVariable String cidade,
            Pageable pageable) {
        
        Page<Doador> doadores = doadorService.buscarDoadoresAtivosNaCidade(cidade, pageable);
        Page<DoadorDTO> doadoresDTO = doadores.map(doadorMapper::toDTO);
        
        return ResponseEntity.ok(doadoresDTO);
    }

    // Outros endpoints existentes...
}
```

---

## 📋 Passo 5: Testes e Validação

### **🧪 Exemplo de Teste Unitário**

```java
package com.faculdade.doesangue_api.specifications;

import com.faculdade.doesangue_api.dto.doador.DoadorRequestFilterDTO;
import com.faculdade.doesangue_api.entities.Doador;
import com.faculdade.doesangue_api.repository.DoadorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class DoadorSpecificationsTest {

    @Autowired
    private DoadorRepository doadorRepository;

    @Test
    void deveFilterarPorNome() {
        // Given
        DoadorRequestFilterDTO filters = new DoadorRequestFilterDTO(
            null, "João", null, null, null, null, null, null, null, null
        );
        
        // When
        Specification<Doador> spec = DoadorSpecifications.withFilters(filters);
        Page<Doador> resultado = doadorRepository.findAll(spec, PageRequest.of(0, 10));
        
        // Then
        assertThat(resultado.getContent())
            .allMatch(doador -> doador.getFullName().toLowerCase().contains("joão"));
    }

    @Test
    void deveFilterarPorCidadeEEstado() {
        // Given
        DoadorRequestFilterDTO filters = new DoadorRequestFilterDTO(
            null, null, null, null, null, "São Paulo", "SP", null, null, null
        );
        
        // When
        Specification<Doador> spec = DoadorSpecifications.withFilters(filters);
        Page<Doador> resultado = doadorRepository.findAll(spec, PageRequest.of(0, 10));
        
        // Then
        assertThat(resultado.getContent())
            .allMatch(doador -> 
                doador.getCidade().toLowerCase().contains("são paulo") &&
                doador.getEstado().equals("SP")
            );
    }
}
```

---

## 🚀 Uso Prático - Exemplos de Requisições

### **📱 Exemplos de Chamadas da API**

```bash
# 1. Buscar todos os doadores (sem filtros)
GET /api/doadores?page=0&size=20

# 2. Buscar por nome
GET /api/doadores?fullName=João Silva&page=0&size=10

# 3. Buscar por cidade e estado
GET /api/doadores?cidade=São Paulo&estado=SP

# 4. Buscar doadores habituais tipo O+
GET /api/doadores?tipoSanguineo=O+&doadorHabitual=true

# 5. Buscar por peso mínimo e ordenar por nome
GET /api/doadores?pesoKg=60&sort=fullName&direction=asc

# 6. Filtro complexo com múltiplos campos
GET /api/doadores?fullName=Maria&cidade=Rio&estado=RJ&empresa=Hospital&page=0&size=5

# 7. Buscar por CPF específico
GET /api/doadores?cpf=12345678901

# 8. Buscar por email parcial
GET /api/doadores?email=gmail.com
```

---

## 💡 Dicas e Boas Práticas

### **✅ Performance:**
- Use `LEFT JOIN` para relacionamentos opcionais
- Evite `EAGER` loading desnecessário
- Considere índices para campos filtrados frequentemente

### **✅ Segurança:**
- Sempre valide entrada de dados
- Use `StringUtils.hasText()` para verificar strings
- Limite tamanho da página (máximo 100)

### **✅ Flexibilidade:**
- Specifications são composáveis
- Pode combinar com outros métodos do repository
- Reutilizável em diferentes contextos

### **✅ Manutenibilidade:**
- Separe Specifications por entidade
- Use nomes descritivos para métodos
- Documente comportamento de cada filtro

---

## 🔧 Configurações Opcionais

### **📊 Custom Repository (Avançado)**

```java
@Repository
public interface DoadorRepository extends 
    JpaRepository<Doador, Long>, 
    JpaSpecificationExecutor<Doador>,
    DoadorRepositoryCustom {
}

interface DoadorRepositoryCustom {
    Page<DoadorProjection> findDoadoresProjection(
        DoadorRequestFilterDTO filters, 
        Pageable pageable
    );
}

@Component
class DoadorRepositoryImpl implements DoadorRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Page<DoadorProjection> findDoadoresProjection(
            DoadorRequestFilterDTO filters, 
            Pageable pageable) {
        
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<DoadorProjection> query = cb.createQuery(DoadorProjection.class);
        Root<Doador> root = query.from(Doador.class);
        
        // Projeção customizada para melhor performance
        query.select(cb.construct(
            DoadorProjection.class,
            root.get("id"),
            root.get("fullName"),
            root.get("email"),
            root.get("cidade")
        ));
        
        // Aplicar filtros usando Specifications
        Specification<Doador> spec = DoadorSpecifications.withFilters(filters);
        Predicate predicate = spec.toPredicate(root, query, cb);
        query.where(predicate);
        
        // Executar query...
        return new PageImpl<>(results, pageable, total);
    }
}
```

---

## 📚 Recursos Adicionais

### **📖 Links Úteis:**
- [Spring Data JPA Specifications](https://docs.spring.io/spring-data/jpa/reference/jpa/specifications.html)
- [Criteria API Guide](https://docs.oracle.com/javaee/7/tutorial/persistence-criteria.htm)
- [Spring Data JPA Query Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods)

### **🔍 Próximos Passos:**
1. Implementar cache para consultas frequentes
2. Adicionar métricas de performance
3. Criar DSL customizada para queries complexas
4. Implementar filtros geoespaciais

---

*Este tutorial fornece uma implementação completa e profissional de JPA Specifications para o projeto DoeSangue, garantindo filtros dinâmicos, performance otimizada e código maintível.*
