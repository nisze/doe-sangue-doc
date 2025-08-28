# 📊 Repository Pattern e Spring Data JPA - Guia Completo

**Finalidade:** Guia fundamental sobre Repository Pattern e Spring Data JPA  
**Foco:** Conceitos, implementação e boas práticas  
**Tecnologia:** Spring Data JPA, Repository Pattern, Query Methods

## 🔗 Links Rápidos para Documentação Oficial

| **Recurso** | **Link** | **Descrição** |
|-------------|----------|---------------|
| 📖 **Spring Data JPA** | [Reference Guide](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/) | Documentação completa oficial |
| 🔧 **Repository Interface** | [Core Concepts](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.core-concepts) | Conceitos fundamentais |
| 🎯 **Query Methods** | [Query Creation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods) | Criação de consultas |
| 📊 **JPA Repository** | [JPA Repositories](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.repositories) | Repositórios JPA específicos |
| 🚀 **Custom Implementations** | [Custom Repository](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.custom-implementations) | Implementações customizadas |

💡 **Mais links detalhados disponíveis na [seção de documentação oficial](#-documentação-oficial-e-referências) no final deste guia.**

---

## 🎯 O que é Repository Pattern?

### **🏗️ Conceito Fundamental**

O **Repository Pattern** é um padrão de design que encapsula a lógica necessária para acessar fontes de dados. Ele centraliza funcionalidades comuns de acesso a dados, proporcionando melhor manutenibilidade e desacoplamento da infraestrutura ou tecnologia usada para acessar bancos de dados.

### **💡 Analogia Prática:**
Imagine o Repository como um **"bibliotecário digital"**:
- 📚 **Você pede** um livro (entidade) pelo título (ID)
- 🔍 **Ele busca** na estante (banco de dados)
- 📖 **Retorna** o livro (objeto) para você
- 📝 **Organiza** novos livros (save) na estante
- 🗑️ **Remove** livros antigos (delete) quando necessário

### **✅ Benefícios do Repository Pattern:**
- **🔄 Abstração** - Esconde detalhes de acesso aos dados
- **🧪 Testabilidade** - Fácil mock para testes unitários
- **🔄 Reutilização** - Centraliza operações comuns
- **📊 Consistência** - Padroniza acesso aos dados
- **🛡️ Manutenibilidade** - Mudanças isoladas em um local

---

## 🚀 Spring Data JPA - O Poder da Automação

### **🎯 O que é Spring Data JPA?**

> 📖 **Documentação:** [Spring Data JPA Introduction](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#preface) | [Getting Started](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#getting-started)

Spring Data JPA é um framework que **automatiza** a implementação do Repository Pattern, gerando automaticamente implementações baseadas em convenções de nomenclatura.

### **🔥 Funcionalidades Principais:**

#### **1. 🤖 Implementação Automática**
```java
// Você define apenas a interface
public interface DoadorRepository extends JpaRepository<Doador, Long> {
    // Spring Data JPA implementa automaticamente!
}

// Spring gera automaticamente:
// - save(doador)
// - findById(id)
// - findAll()
// - delete(doador)
// - count()
// - existsById(id)
// E muito mais!
```

#### **2. 📝 Query Methods por Convenção**
```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {
    
    // Spring entende e gera SQL automaticamente!
    List<Doador> findByFullName(String fullName);
    List<Doador> findByEmailContaining(String email);
    List<Doador> findByCidadeAndEstado(String cidade, String estado);
    List<Doador> findByIdadeBetween(Integer minIdade, Integer maxIdade);
    List<Doador> findByAtivoTrue();
    
    // Equivale a: SELECT d FROM Doador d WHERE d.fullName = ?1
    // Equivale a: SELECT d FROM Doador d WHERE d.email LIKE %?1%
    // E assim por diante...
}
```

#### **3. 📊 Paginação e Ordenação Nativas**
```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {
    
    // Paginação automática
    Page<Doador> findByEstado(String estado, Pageable pageable);
    
    // Slice para performance
    Slice<Doador> findByCidade(String cidade, Pageable pageable);
    
    // Lista ordenada
    List<Doador> findByAtivoTrueOrderByFullNameAsc();
}
```

---

## 📋 Hierarquia de Interfaces Repository

### **🏗️ Estrutura Completa**

> 📖 **Documentação:** [Repository Hierarchy](https://docs.spring.io/spring-data/commons/docs/current/reference/html/#repositories.core-concepts) | [Interface Overview](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.repositories)

```java
// 1. 🔧 Repository (Base) - Marker interface
Repository<T, ID>

// 2. 📚 CrudRepository - CRUD básico
CrudRepository<T, ID> extends Repository<T, ID>

// 3. 📄 PagingAndSortingRepository - Adiciona paginação
PagingAndSortingRepository<T, ID> extends CrudRepository<T, ID>

// 4. 🚀 JpaRepository - Funcionalidades JPA específicas
JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>
```

### **🎯 Quando Usar Cada Interface:**

#### **1. `Repository<T, ID>` - Interface Marker**
```java
// Quando você quer controle total
public interface DoadorRepository extends Repository<Doador, Long> {
    // Define apenas os métodos que precisa
    Optional<Doador> findById(Long id);
    Doador save(Doador doador);
    // Não herda nenhum método automático
}
```

#### **2. `CrudRepository<T, ID>` - CRUD Básico**
```java
public interface DoadorRepository extends CrudRepository<Doador, Long> {
    // Herda automaticamente:
    // save(S entity)
    // saveAll(Iterable<S> entities)
    // findById(ID id)
    // existsById(ID id)
    // findAll()
    // findAllById(Iterable<ID> ids)
    // count()
    // deleteById(ID id)
    // delete(T entity)
    // deleteAll()
}
```

#### **3. `PagingAndSortingRepository<T, ID>` - Com Paginação**
```java
public interface DoadorRepository extends PagingAndSortingRepository<Doador, Long> {
    // Herda tudo do CrudRepository +
    // findAll(Sort sort)
    // findAll(Pageable pageable)
}
```

#### **4. `JpaRepository<T, ID>` - Completo (RECOMENDADO)**
```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {
    // Herda tudo dos anteriores +
    // flush()
    // saveAndFlush(S entity)
    // deleteInBatch(Iterable<T> entities)
    // deleteAllInBatch()
    // getReferenceById(ID id)
    // findAll(Example<S> example)
    // findAll(Example<S> example, Pageable pageable)
}
```

---

## 🔧 Implementação Prática - Projeto DoeSangue

### **📋 Passo 1: Definir a Interface Repository**

> 📖 **Documentação:** [Defining Repository Interfaces](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.definition) | [Repository Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation)

```java
package com.faculdade.doesangue_api.repository;

import com.faculdade.doesangue_api.entities.Doador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // 🔍 QUERY METHODS - Spring gera SQL automaticamente
    
    /**
     * Busca doador por CPF
     * SQL gerado: SELECT d FROM Doador d WHERE d.cpf = ?1
     */
    Optional<Doador> findByCpf(String cpf);
    
    /**
     * Busca doadores por nome (parcial, case-insensitive)
     * SQL gerado: SELECT d FROM Doador d WHERE LOWER(d.fullName) LIKE LOWER(?1)
     */
    List<Doador> findByFullNameContainingIgnoreCase(String nome);
    
    /**
     * Busca doadores por email
     * SQL gerado: SELECT d FROM Doador d WHERE d.email = ?1
     */
    Optional<Doador> findByEmail(String email);
    
    /**
     * Busca doadores ativos por cidade
     * SQL gerado: SELECT d FROM Doador d WHERE d.cidade = ?1 AND d.deletedAt IS NULL
     */
    List<Doador> findByCidadeAndDeletedAtIsNull(String cidade);
    
    /**
     * Busca doadores por estado com paginação
     */
    Page<Doador> findByEstadoAndDeletedAtIsNull(String estado, Pageable pageable);
    
    /**
     * Busca doadores habituais ativos
     */
    List<Doador> findByDoadorHabitudeTrueAndDeletedAtIsNull();
    
    /**
     * Busca doadores por faixa de idade
     */
    List<Doador> findByIdadeBetweenAndDeletedAtIsNull(Integer minIdade, Integer maxIdade);
    
    /**
     * Busca doadores que podem doar (baseado na última doação)
     */
    List<Doador> findByUltimaDoacaoBeforeOrUltimaDoacaoIsNull(LocalDate dataLimite);
    
    // 📝 CUSTOM QUERIES - Quando precisar de controle maior
    
    /**
     * Busca doadores com JOIN customizado
     */
    @Query("SELECT d FROM Doador d " +
           "JOIN d.tipoSanguineo ts " +
           "WHERE ts.tipoAbo = :tipoAbo " +
           "AND ts.fatorRh = :fatorRh " +
           "AND d.deletedAt IS NULL")
    List<Doador> findByTipoSanguineo(
        @Param("tipoAbo") String tipoAbo, 
        @Param("fatorRh") String fatorRh
    );
    
    /**
     * Estatísticas de doadores por cidade
     */
    @Query("SELECT d.cidade, COUNT(d) " +
           "FROM Doador d " +
           "WHERE d.deletedAt IS NULL " +
           "GROUP BY d.cidade " +
           "ORDER BY COUNT(d) DESC")
    List<Object[]> countDoadoresPorCidade();
    
    /**
     * Busca doadores aptos para doar urgente
     */
    @Query("SELECT d FROM Doador d " +
           "WHERE d.deletedAt IS NULL " +
           "AND d.doadorHabitudel = true " +
           "AND (d.ultimaDoacao IS NULL OR d.ultimaDoacao <= :dataLimite) " +
           "AND d.idade BETWEEN 18 AND 65 " +
           "ORDER BY d.ultimaDoacao ASC NULLS FIRST")
    List<Doador> findDoadoresAptosParaDoarUrgente(@Param("dataLimite") LocalDate dataLimite);
    
    // 🔢 QUERIES DE CONTAGEM
    
    /**
     * Conta doadores ativos por estado
     */
    long countByEstadoAndDeletedAtIsNull(String estado);
    
    /**
     * Verifica se existe doador com CPF
     */
    boolean existsByCpfAndDeletedAtIsNull(String cpf);
    
    /**
     * Verifica se existe doador com email
     */
    boolean existsByEmailAndDeletedAtIsNull(String email);
    
    // 🗑️ SOFT DELETE QUERIES
    
    /**
     * Busca apenas doadores ativos (não deletados)
     */
    List<Doador> findByDeletedAtIsNull();
    
    /**
     * Busca doadores deletados (para auditoria)
     */
    List<Doador> findByDeletedAtIsNotNull();
}
```

### **📋 Passo 2: Usar no Service**

> 📖 **Documentação:** [Service Layer](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-stereotypes) | [Transaction Management](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)

```java
package com.faculdade.doesangue_api.service;

import com.faculdade.doesangue_api.entities.Doador;
import com.faculdade.doesangue_api.repository.DoadorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true) // Otimização para operações de leitura
public class DoadorService {

    private final DoadorRepository doadorRepository;

    public DoadorService(DoadorRepository doadorRepository) {
        this.doadorRepository = doadorRepository;
    }

    // 📋 OPERAÇÕES BÁSICAS
    
    public List<Doador> listarTodos() {
        return doadorRepository.findByDeletedAtIsNull();
    }
    
    public Page<Doador> listarComPaginacao(Pageable pageable) {
        return doadorRepository.findAll(pageable);
    }
    
    public Optional<Doador> buscarPorId(Long id) {
        return doadorRepository.findById(id)
            .filter(doador -> doador.getDeletedAt() == null);
    }
    
    public Optional<Doador> buscarPorCpf(String cpf) {
        return doadorRepository.findByCpf(cpf);
    }
    
    public Optional<Doador> buscarPorEmail(String email) {
        return doadorRepository.findByEmail(email);
    }
    
    // 🔍 OPERAÇÕES DE BUSCA
    
    public List<Doador> buscarPorNome(String nome) {
        return doadorRepository.findByFullNameContainingIgnoreCase(nome);
    }
    
    public List<Doador> buscarPorCidade(String cidade) {
        return doadorRepository.findByCidadeAndDeletedAtIsNull(cidade);
    }
    
    public Page<Doador> buscarPorEstado(String estado, Pageable pageable) {
        return doadorRepository.findByEstadoAndDeletedAtIsNull(estado, pageable);
    }
    
    public List<Doador> buscarDoadoresHabituais() {
        return doadorRepository.findByDoadorHabitudeTrueAndDeletedAtIsNull();
    }
    
    public List<Doador> buscarPorFaixaIdade(Integer minIdade, Integer maxIdade) {
        return doadorRepository.findByIdadeBetweenAndDeletedAtIsNull(minIdade, maxIdade);
    }
    
    // 🩸 OPERAÇÕES ESPECÍFICAS DO DOMÍNIO
    
    public List<Doador> buscarDoadoresAptos() {
        // Doadores que podem doar (últim doação > 60 dias ou nunca doaram)
        LocalDate dataLimite = LocalDate.now().minusDays(60);
        return doadorRepository.findByUltimaDoacaoBeforeOrUltimaDoacaoIsNull(dataLimite);
    }
    
    public List<Doador> buscarPorTipoSanguineo(String tipoAbo, String fatorRh) {
        return doadorRepository.findByTipoSanguineo(tipoAbo, fatorRh);
    }
    
    public List<Doador> buscarDoadoresUrgente() {
        LocalDate dataLimite = LocalDate.now().minusDays(60);
        return doadorRepository.findDoadoresAptosParaDoarUrgente(dataLimite);
    }
    
    // 💾 OPERAÇÕES DE PERSISTÊNCIA
    
    @Transactional // Remove readOnly para operações de escrita
    public Doador salvar(Doador doador) {
        return doadorRepository.save(doador);
    }
    
    @Transactional
    public Doador atualizar(Doador doador) {
        return doadorRepository.save(doador);
    }
    
    @Transactional
    public void deletar(Long id) {
        doadorRepository.findById(id)
            .ifPresent(doador -> {
                doador.setDeletedAt(LocalDateTime.now());
                doadorRepository.save(doador); // Soft delete
            });
    }
    
    // 📊 OPERAÇÕES DE ESTATÍSTICA
    
    public long contarPorEstado(String estado) {
        return doadorRepository.countByEstadoAndDeletedAtIsNull(estado);
    }
    
    public boolean existePorCpf(String cpf) {
        return doadorRepository.existsByCpfAndDeletedAtIsNull(cpf);
    }
    
    public boolean existePorEmail(String email) {
        return doadorRepository.existsByEmailAndDeletedAtIsNull(email);
    }
    
    public List<Object[]> obterEstatisticasPorCidade() {
        return doadorRepository.countDoadoresPorCidade();
    }
}
```

### **📋 Passo 3: Usar no Controller**

```java
package com.faculdade.doesangue_api.controller;

import com.faculdade.doesangue_api.entities.Doador;
import com.faculdade.doesangue_api.service.DoadorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doadores")
public class DoadorController {

    private final DoadorService doadorService;

    public DoadorController(DoadorService doadorService) {
        this.doadorService = doadorService;
    }

    @GetMapping
    public ResponseEntity<Page<Doador>> listar(Pageable pageable) {
        Page<Doador> doadores = doadorService.listarComPaginacao(pageable);
        return ResponseEntity.ok(doadores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doador> buscarPorId(@PathVariable Long id) {
        return doadorService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Doador> buscarPorCpf(@PathVariable String cpf) {
        return doadorService.buscarPorCpf(cpf)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Doador>> buscarPorNome(@RequestParam String nome) {
        List<Doador> doadores = doadorService.buscarPorNome(nome);
        return ResponseEntity.ok(doadores);
    }
    
    // Outros endpoints...
}
```

---

## 🔍 Query Methods - Convenções de Nomenclatura

### **📚 Keywords Principais**

> 📖 **Documentação:** [Supported Keywords](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repository-query-keywords) | [Query Creation Examples](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation)

| **Keyword** | **Exemplo** | **SQL Gerado** |
|-------------|-------------|----------------|
| `findBy` | `findByName(String name)` | `WHERE name = ?1` |
| `findByAnd` | `findByNameAndEmail(String name, String email)` | `WHERE name = ?1 AND email = ?2` |
| `findByOr` | `findByNameOrEmail(String name, String email)` | `WHERE name = ?1 OR email = ?2` |
| `findByContaining` | `findByNameContaining(String name)` | `WHERE name LIKE %?1%` |
| `findByStartingWith` | `findByNameStartingWith(String prefix)` | `WHERE name LIKE ?1%` |
| `findByEndingWith` | `findByNameEndingWith(String suffix)` | `WHERE name LIKE %?1` |
| `findByIgnoreCase` | `findByNameIgnoreCase(String name)` | `WHERE UPPER(name) = UPPER(?1)` |
| `findByBetween` | `findByAgeBetween(int start, int end)` | `WHERE age BETWEEN ?1 AND ?2` |
| `findByLessThan` | `findByAgeLessThan(int age)` | `WHERE age < ?1` |
| `findByGreaterThan` | `findByAgeGreaterThan(int age)` | `WHERE age > ?1` |
| `findByIsNull` | `findByEmailIsNull()` | `WHERE email IS NULL` |
| `findByIsNotNull` | `findByEmailIsNotNull()` | `WHERE email IS NOT NULL` |
| `findByTrue` | `findByActiveTrue()` | `WHERE active = true` |
| `findByFalse` | `findByActiveFalse()` | `WHERE active = false` |
| `findByOrderBy` | `findByAgeOrderByNameAsc(int age)` | `WHERE age = ?1 ORDER BY name ASC` |

### **🎯 Exemplos Práticos para DoeSangue:**

```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // Busca simples
    List<Doador> findByFullName(String fullName);
    
    // Busca com LIKE (contém)
    List<Doador> findByFullNameContaining(String nome);
    
    // Busca case-insensitive
    List<Doador> findByFullNameContainingIgnoreCase(String nome);
    
    // Busca com múltiplos campos
    List<Doador> findByCidadeAndEstado(String cidade, String estado);
    
    // Busca com OR
    List<Doador> findByEmailOrTelefonePrincipal(String email, String telefone);
    
    // Busca por range
    List<Doador> findByIdadeBetween(Integer minIdade, Integer maxIdade);
    
    // Busca com condições nulas
    List<Doador> findByDeletedAtIsNull();
    List<Doador> findByUltimaDoacaoIsNotNull();
    
    // Busca com boolean
    List<Doador> findByDoadorHabitudereTrue();
    List<Doador> findByAtivoFalse();
    
    // Busca com ordenação
    List<Doador> findByEstadoOrderByFullNameAsc(String estado);
    List<Doador> findByCidadeOrderByIdadeDescFullNameAsc(String cidade);
    
    // Busca com LIKE e wildcards
    List<Doador> findByEmailStartingWith(String prefixo); // email LIKE 'prefix%'
    List<Doador> findByFullNameEndingWith(String sufixo); // nome LIKE '%sufixo'
    
    // Busca por data
    List<Doador> findByDataNascimentoBefore(LocalDate data);
    List<Doador> findByCreatedAtAfter(LocalDateTime data);
    
    // Contadores
    long countByCidade(String cidade);
    long countByEstadoAndAtivoTrue(String estado);
    
    // Verificação de existência
    boolean existsByCpf(String cpf);
    boolean existsByEmailAndDeletedAtIsNull(String email);
    
    // Primeira ocorrência
    Optional<Doador> findFirstByOrderByCreatedAtDesc();
    Optional<Doador> findTopByEstadoOrderByIdadeAsc(String estado);
}
```

---

## 🧪 Testes com Repository

### **🔧 Teste Unitário com @DataJpaTest**

> 📖 **Documentação:** [Testing Data Layer](https://docs.spring.io/spring-boot/docs/current/reference/html/testing.html#testing.spring-boot-applications.testing-autoconfigured-jpa) | [@DataJpaTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/DataJpaTest.html)

```java
package com.faculdade.doesangue_api.repository;

import com.faculdade.doesangue_api.entities.Doador;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class DoadorRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private DoadorRepository doadorRepository;

    @Test
    void deveBuscarDoadorPorCpf() {
        // Given
        Doador doador = new Doador();
        doador.setCpf("12345678901");
        doador.setFullName("João Silva");
        doador.setEmail("joao@email.com");
        entityManager.persistAndFlush(doador);

        // When
        Optional<Doador> resultado = doadorRepository.findByCpf("12345678901");

        // Then
        assertThat(resultado).isPresent();
        assertThat(resultado.get().getFullName()).isEqualTo("João Silva");
    }

    @Test
    void deveBuscarDoadoresPorNomeContendo() {
        // Given
        Doador doador1 = criarDoador("João Silva", "joao@email.com");
        Doador doador2 = criarDoador("Maria João", "maria@email.com");
        Doador doador3 = criarDoador("Pedro Santos", "pedro@email.com");
        
        entityManager.persistAndFlush(doador1);
        entityManager.persistAndFlush(doador2);
        entityManager.persistAndFlush(doador3);

        // When
        List<Doador> resultado = doadorRepository.findByFullNameContainingIgnoreCase("joão");

        // Then
        assertThat(resultado).hasSize(2);
        assertThat(resultado).extracting(Doador::getFullName)
            .containsExactlyInAnyOrder("João Silva", "Maria João");
    }

    @Test
    void deveRetornarPaginacaoCorretamente() {
        // Given
        for (int i = 1; i <= 25; i++) {
            Doador doador = criarDoador("Doador " + i, "doador" + i + "@email.com");
            entityManager.persist(doador);
        }
        entityManager.flush();

        // When
        Page<Doador> primeiraPagina = doadorRepository.findAll(PageRequest.of(0, 10));
        Page<Doador> segundaPagina = doadorRepository.findAll(PageRequest.of(1, 10));

        // Then
        assertThat(primeiraPagina.getContent()).hasSize(10);
        assertThat(primeiraPagina.getTotalElements()).isEqualTo(25);
        assertThat(primeiraPagina.getTotalPages()).isEqualTo(3);
        assertThat(segundaPagina.getContent()).hasSize(10);
    }

    @Test
    void deveContarDoadoresPorEstado() {
        // Given
        entityManager.persist(criarDoadorComEstado("Doador 1", "SP"));
        entityManager.persist(criarDoadorComEstado("Doador 2", "SP"));
        entityManager.persist(criarDoadorComEstado("Doador 3", "RJ"));
        entityManager.flush();

        // When
        long countSP = doadorRepository.countByEstadoAndDeletedAtIsNull("SP");
        long countRJ = doadorRepository.countByEstadoAndDeletedAtIsNull("RJ");

        // Then
        assertThat(countSP).isEqualTo(2);
        assertThat(countRJ).isEqualTo(1);
    }

    @Test
    void deveVerificarExistenciaPorEmail() {
        // Given
        Doador doador = criarDoador("João Silva", "joao@email.com");
        entityManager.persistAndFlush(doador);

        // When/Then
        assertThat(doadorRepository.existsByEmailAndDeletedAtIsNull("joao@email.com")).isTrue();
        assertThat(doadorRepository.existsByEmailAndDeletedAtIsNull("inexistente@email.com")).isFalse();
    }

    // Métodos auxiliares
    private Doador criarDoador(String nome, String email) {
        Doador doador = new Doador();
        doador.setFullName(nome);
        doador.setEmail(email);
        doador.setCpf("12345678901");
        doador.setDataNascimento(LocalDate.of(1990, 1, 1));
        return doador;
    }

    private Doador criarDoadorComEstado(String nome, String estado) {
        Doador doador = criarDoador(nome, nome.toLowerCase().replace(" ", "") + "@email.com");
        doador.setEstado(estado);
        return doador;
    }
}
```

---

## 💡 Boas Práticas e Dicas Avançadas

### **✅ Convenções de Nomenclatura**

```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // ✅ GOOD: Nomes descritivos e claros
    List<Doador> findByFullNameContainingIgnoreCase(String nome);
    Optional<Doador> findByEmailAndDeletedAtIsNull(String email);
    Page<Doador> findByEstadoOrderByCreatedAtDesc(String estado, Pageable pageable);

    // ❌ BAD: Nomes ambíguos ou confusos
    List<Doador> findByName(String nome); // Qual nome? Full? First? Last?
    List<Doador> find(String value); // Busca por qual campo?
    List<Doador> getStuff(); // Muito genérico
}
```

### **✅ Performance e Otimização**

```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // ✅ Use Slice quando não precisar do total de elementos
    Slice<Doador> findByEstado(String estado, Pageable pageable);

    // ✅ Use Stream para processamento de grandes volumes
    @Query("SELECT d FROM Doador d WHERE d.ativo = true")
    Stream<Doador> streamAllActiveDoadores();

    // ✅ Use projeções para buscar apenas campos necessários
    @Query("SELECT d.id, d.fullName, d.email FROM Doador d WHERE d.estado = :estado")
    List<Object[]> findBasicInfoByEstado(@Param("estado") String estado);

    // ✅ Use EXISTS para verificações de existência (mais eficiente)
    @Query("SELECT CASE WHEN COUNT(d) > 0 THEN true ELSE false END FROM Doador d WHERE d.cpf = :cpf")
    boolean existsByCpfCustom(@Param("cpf") String cpf);
}
```

### **✅ Tratamento de Null e Optional**

```java
@Service
public class DoadorService {

    // ✅ GOOD: Use Optional para retornos que podem ser nulos
    public Optional<Doador> buscarPorId(Long id) {
        return doadorRepository.findById(id);
    }

    // ✅ GOOD: Trate parâmetros nulos adequadamente
    public List<Doador> buscarPorNome(String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return List.of(); // Retorna lista vazia em vez de null
        }
        return doadorRepository.findByFullNameContainingIgnoreCase(nome.trim());
    }

    // ✅ GOOD: Use orElse para valores padrão
    public Doador buscarOuCriarDefault(Long id) {
        return doadorRepository.findById(id)
            .orElse(new Doador()); // Retorna instância padrão
    }
}
```

---

## 📊 Índices de Banco de Dados - Performance e Otimização

### **🎯 O que são Índices?**

> 📖 **Documentação:** [MySQL Indexes](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html) | [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html) | [JPA Index Annotation](https://jakarta.ee/specifications/persistence/3.1/apidocs/jakarta.persistence/jakarta/persistence/index)

**Índices** são estruturas de dados especiais que melhoram a velocidade de operações de consulta em uma tabela de banco de dados. Funcionam como um **"índice de livro"** - permitem localizar dados rapidamente sem varrer toda a tabela.

### **🏗️ Analogia Prática:**

Imagine uma **biblioteca com 10.000 livros**:
- **📚 Sem índice** - Você precisa verificar livro por livro para encontrar "Dom Casmurro"
- **📇 Com índice** - Você consulta o catálogo por título e vai direto à estante correta

### **🚀 Por que Usar Índices?**

#### **1. 🔍 Performance de Consultas**
```sql
-- SEM ÍNDICE: Busca sequencial em 1 milhão de registros
SELECT * FROM doador WHERE cpf = '12345678901';
-- Tempo: ~500ms (varre toda a tabela)

-- COM ÍNDICE: Busca logarítmica
CREATE INDEX idx_doador_cpf ON doador(cpf);
SELECT * FROM doador WHERE cpf = '12345678901';
-- Tempo: ~2ms (acesso direto)
```

#### **2. 📈 Escalabilidade**
```java
// Repository que se beneficia de índices
public interface DoadorRepository extends JpaRepository<Doador, Long> {
    
    // Busca por CPF - DEVE ter índice único
    Optional<Doador> findByCpf(String cpf);
    
    // Busca por email - DEVE ter índice único  
    Optional<Doador> findByEmail(String email);
    
    // Filtros combinados - DEVE ter índice composto
    List<Doador> findByCidadeAndEstado(String cidade, String estado);
    
    // Ordenação - DEVE ter índice para performance
    List<Doador> findByAtivoTrueOrderByCreatedAtDesc();
}
```

#### **3. 🎯 Integridade Referencial**
```java
@Entity
@Table(name = "doador")
public class Doador {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Índice automático (PRIMARY KEY)
    
    @Column(unique = true) // Cria índice único automaticamente
    private String cpf;
    
    @Column(unique = true) // Cria índice único automaticamente
    private String email;
}
```

### **✅ Principais Benefícios dos Índices**

| **Benefício** | **Descrição** | **Impacto** |
|---------------|---------------|-------------|
| **⚡ Velocidade** | Consultas até 1000x mais rápidas | Reduz tempo de resposta drasticamente |
| **📈 Escalabilidade** | Performance mantida com milhões de registros | Sistema cresce sem degradação |
| **🔒 Unicidade** | Garante valores únicos (CPF, email) | Integridade de dados automática |
| **🔍 Busca Eficiente** | Localização logarítmica vs linear | O(log n) vs O(n) |
| **📊 Ordenação Rápida** | ORDER BY otimizado | Resultados ordenados sem overhead |
| **🔗 JOINs Eficientes** | Relacionamentos mais rápidos | Consultas complexas otimizadas |

### **🎯 Tipos de Índices e Quando Usar**

#### **1. 🔑 Primary Key Index (Automático)**
```java
@Entity
public class Doador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // MySQL cria CLUSTERED INDEX automaticamente
}
```

#### **2. 🔐 Unique Index (Constraints)**
```java
@Entity
@Table(name = "doador", indexes = {
    @Index(name = "idx_doador_cpf", columnList = "cpf", unique = true),
    @Index(name = "idx_doador_email", columnList = "email", unique = true)
})
public class Doador {
    
    @Column(unique = true, length = 11)
    private String cpf; // Índice único para consultas rápidas
    
    @Column(unique = true, length = 100)
    private String email; // Índice único para login/validação
}
```

#### **3. 📊 Single Column Index**
```java
@Entity
@Table(name = "doador", indexes = {
    @Index(name = "idx_doador_cidade", columnList = "cidade"),
    @Index(name = "idx_doador_estado", columnList = "estado"),
    @Index(name = "idx_doador_ativo", columnList = "ativo"),
    @Index(name = "idx_doador_created_at", columnList = "createdAt")
})
public class Doador {
    
    private String cidade; // Para filtros por localização
    private String estado; // Para relatórios estaduais
    private Boolean ativo; // Para filtros de status
    private LocalDateTime createdAt; // Para ordenação temporal
}
```

#### **4. 🎯 Composite Index (Múltiplas Colunas)**
```java
@Entity
@Table(name = "doador", indexes = {
    // Índice composto para filtros combinados
    @Index(name = "idx_doador_cidade_estado", columnList = "cidade, estado"),
    
    // Índice para soft delete + filtros
    @Index(name = "idx_doador_ativo_cidade", columnList = "ativo, cidade"),
    
    // Índice para busca com ordenação
    @Index(name = "idx_doador_estado_created", columnList = "estado, createdAt")
})
public class Doador {
    // A ordem das colunas no índice é IMPORTANTE!
    // cidade, estado != estado, cidade
}
```

#### **5. 🔍 Functional Index (Casos Especiais)**
```sql
-- Para busca case-insensitive em nomes
CREATE INDEX idx_doador_nome_lower ON doador(LOWER(full_name));

-- Para busca por prefixo de telefone
CREATE INDEX idx_doador_ddd ON doador(LEFT(telefone_principal, 2));
```

### **🔧 Implementação Prática com JPA**

#### **📋 Exemplo Completo - Entidade Doador Otimizada**
```java
@Entity
@Table(name = "doador", indexes = {
    // 🔐 Índices únicos para integridade
    @Index(name = "idx_doador_cpf", columnList = "cpf", unique = true),
    @Index(name = "idx_doador_email", columnList = "email", unique = true),
    
    // 🔍 Índices para consultas frequentes
    @Index(name = "idx_doador_cidade", columnList = "cidade"),
    @Index(name = "idx_doador_estado", columnList = "estado"),
    @Index(name = "idx_doador_tipo_sanguineo", columnList = "tipoSanguineoId"),
    
    // 🎯 Índices compostos para filtros combinados
    @Index(name = "idx_doador_cidade_estado", columnList = "cidade, estado"),
    @Index(name = "idx_doador_ativo_cidade", columnList = "ativo, cidade"),
    
    // ⏰ Índices para ordenação e data
    @Index(name = "idx_doador_created_at", columnList = "createdAt"),
    @Index(name = "idx_doador_ultima_doacao", columnList = "ultimaDoacao"),
    
    // 🗑️ Soft delete otimizado
    @Index(name = "idx_doador_deleted_at", columnList = "deletedAt"),
    @Index(name = "idx_doador_ativo_deleted", columnList = "ativo, deletedAt")
})
public class Doador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // PRIMARY KEY (índice automático)

    @Column(unique = true, length = 11, nullable = false)
    private String cpf; // Índice único

    @Column(unique = true, length = 100, nullable = false)  
    private String email; // Índice único

    @Column(length = 100, nullable = false)
    private String fullName; // Pode precisar de índice para busca

    @Column(length = 50)
    private String cidade; // Índice simples

    @Column(length = 2)
    private String estado; // Índice simples

    @Column(nullable = false)
    private Boolean ativo = true; // Índice para filtros

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt; // Índice para ordenação

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt; // Soft delete

    @Column(name = "ultima_doacao")
    private LocalDate ultimaDoacao; // Índice para regras de negócio

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_sanguineo_id")
    private TipoSanguineo tipoSanguineo; // Foreign key (índice automático)
}
```

#### **📊 Repository Otimizado com Índices**
```java
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // ✅ OTIMIZADO: usa idx_doador_cpf (único)
    Optional<Doador> findByCpf(String cpf);

    // ✅ OTIMIZADO: usa idx_doador_email (único)  
    Optional<Doador> findByEmail(String email);

    // ✅ OTIMIZADO: usa idx_doador_cidade_estado (composto)
    List<Doador> findByCidadeAndEstado(String cidade, String estado);

    // ✅ OTIMIZADO: usa idx_doador_ativo_deleted
    List<Doador> findByAtivoTrueAndDeletedAtIsNull();

    // ✅ OTIMIZADO: usa idx_doador_created_at para ORDER BY
    List<Doador> findByEstadoOrderByCreatedAtDesc(String estado);

    // ✅ OTIMIZADO: usa idx_doador_ultima_doacao
    List<Doador> findByUltimaDoacaoBeforeAndAtivoTrue(LocalDate data);

    // ⚠️ CUIDADO: busca por nome pode ser lenta sem índice
    List<Doador> findByFullNameContainingIgnoreCase(String nome);
    // Solução: Considere índice FULLTEXT ou busca externa (Elasticsearch)
}
```

### **📈 Análise de Performance**

#### **🔍 Como Verificar se Índices Estão Sendo Usados**

**MySQL:**
```sql
-- Verificar plano de execução
EXPLAIN SELECT * FROM doador WHERE cpf = '12345678901';

-- Analisar índices da tabela
SHOW INDEXES FROM doador;

-- Estatísticas de uso dos índices
SELECT * FROM information_schema.STATISTICS WHERE table_name = 'doador';
```

**PostgreSQL:**
```sql
-- Verificar plano de execução
EXPLAIN ANALYZE SELECT * FROM doador WHERE cpf = '12345678901';

-- Listar índices
\d+ doador

-- Verificar uso dos índices
SELECT * FROM pg_stat_user_indexes WHERE relname = 'doador';
```

#### **📊 Métricas de Performance**

| **Cenário** | **Sem Índice** | **Com Índice** | **Melhoria** |
|-------------|-----------------|----------------|--------------|
| Busca por CPF (1M registros) | 500ms | 2ms | **250x mais rápido** |
| Login por email | 300ms | 1ms | **300x mais rápido** |
| Filtro cidade + estado | 800ms | 5ms | **160x mais rápido** |
| Ordenação por data | 1200ms | 10ms | **120x mais rápido** |
| COUNT(*) com WHERE | 600ms | 3ms | **200x mais rápido** |

### **⚠️ Cuidados e Trade-offs**

#### **❌ Problemas com Muitos Índices**
```java
// ❌ RUIM: Índices demais
@Table(indexes = {
    @Index(columnList = "campo1"),
    @Index(columnList = "campo2"), 
    @Index(columnList = "campo3"),
    @Index(columnList = "campo4"),
    @Index(columnList = "campo5"),
    @Index(columnList = "campo1, campo2"),
    @Index(columnList = "campo1, campo3"),
    // ... 20+ índices
})

// ✅ BOM: Índices estratégicos
@Table(indexes = {
    @Index(columnList = "cpf", unique = true),           // Busca única
    @Index(columnList = "cidade, estado"),               // Filtro comum
    @Index(columnList = "ativo, deletedAt"),            // Soft delete
    @Index(columnList = "createdAt")                     // Ordenação
})
```

#### **📊 Impacto em Operações de Escrita**
```java
@Service
public class DoadorService {

    // ⚠️ CUIDADO: INSERT/UPDATE ficam mais lentos com muitos índices
    @Transactional
    public Doador salvar(Doador doador) {
        // MySQL precisa atualizar TODOS os índices na inserção
        return doadorRepository.save(doador);
    }

    // ✅ SOLUÇÃO: Batch inserts para grandes volumes
    @Transactional
    public List<Doador> salvarLote(List<Doador> doadores) {
        return doadorRepository.saveAll(doadores); // Mais eficiente
    }
}
```

### **🛠️ Estratégias de Indexação**

#### **1. 🎯 Índices Baseados em Query Patterns**
```java
// Analise suas consultas mais frequentes:
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // 🔥 CONSULTA FREQUENTE: Login/Autenticação
    Optional<Doador> findByEmail(String email);
    // ÍNDICE NECESSÁRIO: email (único)

    // 🔥 CONSULTA FREQUENTE: Busca por documento
    Optional<Doador> findByCpf(String cpf);
    // ÍNDICE NECESSÁRIO: cpf (único)

    // 🔥 CONSULTA FREQUENTE: Relatórios por região
    List<Doador> findByCidadeAndEstado(String cidade, String estado);
    // ÍNDICE NECESSÁRIO: (cidade, estado) composto

    // 🔍 CONSULTA RARA: Busca por nome
    List<Doador> findByFullNameLike(String nome);
    // ÍNDICE OPCIONAL: considere busca externa (Elasticsearch)
}
```

#### **2. 📊 Monitoramento de Performance**
```java
// Configuração de logging para queries lentas
# application.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Logging de queries lentas (> 1 segundo)
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# MySQL: log de queries lentas
slow_query_log=1
long_query_time=1
```

#### **3. 🔧 Ferramentas de Análise**
```java
// Bean para monitorar performance
@Component
public class DatabasePerformanceMonitor {

    @EventListener
    public void handleQueryExecution(QueryExecutionEvent event) {
        if (event.getDuration() > 1000) { // > 1 segundo
            log.warn("Slow query detected: {} ms - {}", 
                event.getDuration(), event.getSql());
        }
    }
}
```

---

## 🌟 Recursos Avançados

### **🔧 Custom Repository Implementation**

> 📖 **Documentação:** [Custom Repository Implementations](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.custom-implementations) | [Criteria API](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#specifications)

```java
// Interface customizada
public interface DoadorRepositoryCustom {
    List<Doador> findWithComplexCriteria(String nome, String cidade, Integer minIdade);
    Page<DoadorStatisticsDTO> findStatisticsGroupedByCity(Pageable pageable);
}

// Implementação customizada
@Repository
public class DoadorRepositoryImpl implements DoadorRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Doador> findWithComplexCriteria(String nome, String cidade, Integer minIdade) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Doador> query = cb.createQuery(Doador.class);
        Root<Doador> root = query.from(Doador.class);

        List<Predicate> predicates = new ArrayList<>();

        if (nome != null && !nome.trim().isEmpty()) {
            predicates.add(
                cb.like(cb.lower(root.get("fullName")), "%" + nome.toLowerCase() + "%")
            );
        }

        if (cidade != null && !cidade.trim().isEmpty()) {
            predicates.add(cb.equal(root.get("cidade"), cidade));
        }

        if (minIdade != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("idade"), minIdade));
        }

        query.where(predicates.toArray(new Predicate[0]));
        query.orderBy(cb.asc(root.get("fullName")));

        return entityManager.createQuery(query).getResultList();
    }
}

// Repository principal herda da customizada
public interface DoadorRepository extends 
    JpaRepository<Doador, Long>, 
    DoadorRepositoryCustom {
    // Métodos padrão + métodos customizados
}
```

### **📊 Projeções e DTOs**

```java
// Interface de projeção
public interface DoadorProjection {
    String getFullName();
    String getEmail();
    String getCidade();
    Integer getIdade();
}

// DTO de projeção
public class DoadorSummaryDTO {
    private String nome;
    private String cidade;
    private String estado;
    
    // Construtores, getters, setters
}

// Uso no Repository
public interface DoadorRepository extends JpaRepository<Doador, Long> {

    // Projeção com interface
    List<DoadorProjection> findProjectedByEstado(String estado);

    // Projeção com DTO e construtor
    @Query("SELECT new com.faculdade.doesangue_api.dto.DoadorSummaryDTO(d.fullName, d.cidade, d.estado) " +
           "FROM Doador d WHERE d.ativo = true")
    List<DoadorSummaryDTO> findSummaryOfActiveDoadores();
}
```

---

## 📚 Documentação Oficial e Referências

### **🌟 Spring Data JPA - Documentação Principal**

#### **📖 Core Documentation:**
- **[Spring Data JPA Reference](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)** - Documentação completa oficial
- **[Repository Interfaces](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.core-concepts)** - Conceitos fundamentais
- **[Query Methods](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods)** - Criação de consultas
- **[Custom Implementations](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.custom-implementations)** - Implementações customizadas

#### **📖 Query Creation:**
- **[Supported Keywords](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repository-query-keywords)** - Palavras-chave para queries
- **[Query Creation Examples](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repositories.query-methods.query-creation)** - Exemplos práticos
- **[Named Queries](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.named-queries)** - Queries nomeadas
- **[@Query Annotation](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.query-methods.at-query)** - Queries customizadas

### **🔧 JPA e Hibernate - Core**

#### **📖 JPA Specification:**
- **[Jakarta Persistence API](https://jakarta.ee/specifications/persistence/3.1/)** - Especificação oficial JPA 3.1
- **[Entity Relationships](https://docs.oracle.com/javaee/7/tutorial/persistence-intro003.htm)** - Relacionamentos entre entidades
- **[JPQL Guide](https://docs.oracle.com/javaee/7/tutorial/persistence-querylanguage.htm)** - Java Persistence Query Language

#### **📖 Hibernate Documentation:**
- **[Hibernate ORM User Guide](https://docs.jboss.org/hibernate/orm/6.2/userguide/html_single/Hibernate_User_Guide.html)** - Guia completo
- **[HQL Reference](https://docs.jboss.org/hibernate/orm/6.2/userguide/html_single/Hibernate_User_Guide.html#hql)** - Hibernate Query Language
- **[Criteria API](https://docs.jboss.org/hibernate/orm/6.2/userguide/html_single/Hibernate_User_Guide.html#criteria)** - API de critérios

### **🚀 Spring Framework - Base**

#### **📖 Spring Framework Core:**
- **[Spring Framework Reference](https://docs.spring.io/spring-framework/docs/current/reference/html/)** - Documentação completa
- **[Data Access with JPA](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#orm-jpa)** - Integração JPA
- **[Transaction Management](https://docs.spring.io/spring-framework/docs/current/reference/html/data-access.html#transaction)** - Gerenciamento de transações

#### **📖 Spring Boot:**
- **[Spring Boot Data JPA](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql.jpa-and-spring-data)** - Configuração automática
- **[Application Properties](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#application-properties.data)** - Propriedades de configuração
- **[Testing Data Layer](https://docs.spring.io/spring-boot/docs/current/reference/html/testing.html#testing.spring-boot-applications.testing-autoconfigured-jpa)** - Testes com @DataJpaTest

### **📊 Testing e Quality**

#### **📖 Testing Frameworks:**
- **[@DataJpaTest](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/DataJpaTest.html)** - Testes de repositório
- **[TestEntityManager](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/autoconfigure/orm/jpa/TestEntityManager.html)** - Gerenciamento de entidades em testes
- **[AssertJ](https://assertj.github.io/doc/)** - Assertions fluentes
- **[TestContainers](https://www.testcontainers.org/modules/databases/)** - Testes com containers

### **📊 Database Indexes e Performance**

#### **📖 Database-Specific Documentation:**
- **[MySQL Indexes Guide](https://dev.mysql.com/doc/refman/8.0/en/mysql-indexes.html)** - Guia completo de índices MySQL
- **[MySQL Index Optimization](https://dev.mysql.com/doc/refman/8.0/en/optimization-indexes.html)** - Otimização de índices
- **[PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)** - Documentação oficial PostgreSQL
- **[PostgreSQL Index Types](https://www.postgresql.org/docs/current/indexes-types.html)** - Tipos de índices disponíveis
- **[H2 Database Indexes](http://h2database.com/html/performance.html#indexes)** - Índices em H2 (testes)

#### **📖 JPA Index Annotations:**
- **[JPA Index Annotation](https://jakarta.ee/specifications/persistence/3.1/apidocs/jakarta.persistence/jakarta/persistence/index)** - Especificação oficial @Index
- **[Hibernate Index Strategies](https://docs.jboss.org/hibernate/orm/6.2/userguide/html_single/Hibernate_User_Guide.html#schema-generation-database-objects)** - Estratégias de criação de índices
- **[Spring Boot Database Initialization](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql.datasource.initialization)** - Inicialização de esquemas

#### **📖 Performance e Monitoring:**
- **[MySQL Performance Schema](https://dev.mysql.com/doc/refman/8.0/en/performance-schema.html)** - Monitoramento de performance
- **[PostgreSQL Query Performance](https://www.postgresql.org/docs/current/using-explain.html)** - EXPLAIN e análise de queries
- **[JPA Performance Tuning](https://vladmihalcea.com/jpa-hibernate-performance-tuning/)** - Blog Vlad Mihalcea sobre performance
- **[Database Index Design](https://use-the-index-luke.com/)** - Guia completo sobre design de índices

#### **📖 Tools e Profiling:**
- **[MySQL Workbench](https://dev.mysql.com/doc/workbench/en/wb-performance.html)** - Ferramentas de performance
- **[pgAdmin Query Tool](https://www.pgadmin.org/docs/pgadmin4/latest/query_tool.html)** - Análise de queries PostgreSQL
- **[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html#actuator.metrics)** - Métricas de aplicação
- **[Hibernate Statistics](https://docs.jboss.org/hibernate/orm/6.2/userguide/html_single/Hibernate_User_Guide.html#statistics)** - Estatísticas do Hibernate

### **🎯 Performance e Optimization**

#### **📖 Performance Guides:**
- **[JPA Performance Best Practices](https://vladmihalcea.com/jpa-hibernate-performance-tuning/)** - Blog Vlad Mihalcea
- **[N+1 Query Problem](https://docs.jboss.org/hibernate/orm/6.2/userguide/html_single/Hibernate_User_Guide.html#fetching-strategies)** - Estratégias de fetch
- **[Connection Pooling](https://docs.spring.io/spring-boot/docs/current/reference/html/data.html#data.sql.datasource.connection-pool)** - Pool de conexões

### **🎓 Tutorials e Examples**

#### **📖 Official Guides:**
- **[Accessing Data with JPA](https://spring.io/guides/gs/accessing-data-jpa/)** - Tutorial básico oficial
- **[Spring Data JPA Examples](https://github.com/spring-projects/spring-data-examples/tree/main/jpa)** - Exemplos oficiais no GitHub

#### **📖 Community Resources:**
- **[Baeldung JPA Tutorials](https://www.baeldung.com/persistence-with-spring-series)** - Série completa sobre persistência
- **[Thorben Janssen's JPA Tips](https://thorben-janssen.com/)** - Blog especializado em JPA/Hibernate
- **[Spring Data JPA Query Methods](https://www.petrikainulainen.net/spring-data-jpa-tutorial/)** - Tutorial detalhado

### **⚡ Quick References**

#### **🔖 Cheat Sheets:**
- **[JPA Annotations Reference](https://www.baeldung.com/jpa-annotations)** - Anotações JPA essenciais
- **[Spring Data Query Keywords](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#repository-query-keywords)** - Keywords para query methods
- **[JPQL Syntax Reference](https://docs.oracle.com/html/E13946_04/ejb3_langref.html)** - Sintaxe JPQL

---

## 🎯 Conclusão

O **Repository Pattern** com **Spring Data JPA** oferece uma abordagem poderosa e elegante para acesso a dados:

### **✅ Benefícios Principais:**
- **🤖 Automação** - Spring gera implementações automaticamente
- **📝 Convenções** - Query methods por nomenclatura
- **🔄 Flexibilidade** - Custom queries quando necessário
- **🧪 Testabilidade** - Fácil mock e teste unitário
- **📊 Performance** - Otimizações automáticas e manuais
- **🛡️ Manutenibilidade** - Código limpo e organizado

### **🚀 Próximos Passos:**
1. **Implementar** repository básico para suas entidades
2. **Explorar** query methods por convenção
3. **Adicionar** queries customizadas conforme necessário
4. **Testar** com @DataJpaTest
5. **Evoluir** para Specifications para filtros complexos

---

*Este guia fornece uma base sólida para compreender e implementar o Repository Pattern com Spring Data JPA no projeto DoeSangue.*
