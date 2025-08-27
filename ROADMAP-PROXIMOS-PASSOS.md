# 🗺️ Roadmap Completo - Sistema DoeSangue

**Data:** 27 de Agosto de 2025  
**Status Atual:** FASE 1 Implementada + Swagger Configurado

---

## 📊 Status Atual da Aplicação

### ✅ **O Que Já Temos (FASE 1):**
- **5 Entidades Originais:** User, UserRole, Hemocentro, Doador, TipoSanguineo
- **4 Entidades Novas:** SetorAtuacao, UserSetor, DoencaEspecifica, DoadorDoenca
- **Swagger/OpenAPI:** Configuração completa e profissional
- **Documentação:** Entidades e APIs documentadas
- **Arquitetura:** 4 agregados DDD definidos
- **Base de Dados:** Schema SQL completo (17 tabelas)

### 🔄 **O Que Falta Implementar:**
- **Controllers REST** para as entidades existentes
- **DTOs** para entrada/saída de dados
- **Services** com regras de negócio
- **Repositories** customizados
- **FASE 2 Entidades:** Triagem, Agendamento, Doação, Estoque
- **Sistema de Autenticação JWT**
- **Validações de Negócio**
- **Testes Automatizados**

---

## 🎯 FASE 2: Implementação de Controllers e APIs

### **Prioridade 1: Infraestrutura de APIs (1-2 semanas)**

#### **2.1 Sistema de Autenticação**
```java
// Controllers a implementar:
@RestController("/api/auth")
public class AuthController {
    @PostMapping("/login")     // Login com JWT
    @PostMapping("/refresh")   // Refresh token
    @PostMapping("/logout")    // Logout
    @GetMapping("/me")         // Dados do usuário logado
}
```

**Tarefas:**
- [ ] Implementar `AuthController`
- [ ] Criar `JwtService` para geração/validação de tokens
- [ ] Configurar Spring Security
- [ ] Criar `AuthDTO` (login/response)
- [ ] Implementar middleware de autenticação

#### **2.2 DTOs Base do Sistema**
```java
// Criar DTOs para todas as entidades:
- UserDTO, UserCreateDTO, UserUpdateDTO
- DoadorDTO, DoadorCreateDTO, DoadorUpdateDTO  
- HemocentroDTO, SetorAtuacaoDTO
- TipoSanguineoDTO, DoencaEspecificaDTO
```

**Padrão de DTOs:**
- **ViewDTO:** Para listagem/visualização
- **CreateDTO:** Para criação (sem ID)
- **UpdateDTO:** Para atualização (com ID)
- **DetailDTO:** Para detalhes completos

#### **2.3 Controllers CRUD Básicos**
```java
// Implementar controllers para entidades FASE 1:
1. UserController           (/api/users)
2. HemocentroController     (/api/hemocentros)  
3. SetorAtuacaoController   (/api/setores)
4. DoadorController         (/api/doadores)
5. TipoSanguineoController  (/api/tipos-sanguineos)
6. DoencaController         (/api/doencas)
```

**Padrão de Endpoints:**
- `GET /api/resource` - Listar (paginado)
- `GET /api/resource/{id}` - Buscar por ID
- `POST /api/resource` - Criar
- `PUT /api/resource/{id}` - Atualizar
- `DELETE /api/resource/{id}` - Deletar (soft delete)

### **Prioridade 2: Services e Regras de Negócio (2-3 semanas)**

#### **2.4 Services com Validações**
```java
@Service
public class DoadorService {
    // Regras específicas de doadores
    public void validarIdadeMinima(LocalDate birthDate);
    public void validarCpfUnico(String cpf);
    public boolean podeDoar(Long doadorId);
    public List<DoencaEspecifica> obterDoencasImpedientes(Long doadorId);
}

@Service  
public class UserService {
    // Gestão de usuários e permissões
    public void validarCredenciais(String email, String senha);
    public void gerenciarSetores(Long userId, List<Long> setorIds);
    public boolean temPermissao(Long userId, String acao);
}
```

#### **2.5 Repositories Customizados**
```java
// Queries específicas do negócio:
public interface DoadorRepository extends JpaRepository<Doador, Long> {
    List<Doador> findByTipoSanguineo(String tipo);
    List<Doador> findAptosParaDoacao();
    Page<Doador> findByHemocentro(Long hemocentroId, Pageable pageable);
}

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findBySetor(Long setorId);
}
```

#### **2.6 Validações de Integridade**
```java
@Component
public class DoadorValidator {
    public void validarDadosCompletos(DoadorCreateDTO dto);
    public void validarIdadeParaDoacao(LocalDate birthDate);
    public void validarDoencasImpedientes(List<Long> doencaIds);
}
```

---

## 🩸 FASE 3: Processo Completo de Doação (3-4 semanas)

### **Prioridade 3: Entidades do Processo de Doação**

#### **3.1 Implementar Entidades FASE 2**
```java
// Criar e implementar:
1. TriagemClinica    + TriagemController + TriagemService
2. Agendamento       + AgendamentoController + AgendamentoService  
3. Doacao            + DoacaoController + DoacaoService
4. EstoqueSangue     + EstoqueController + EstoqueService
```

#### **3.2 Workflow Completo de Doação**
```java
@Service
public class ProcessoDoacaoService {
    
    // 1. Agendamento
    public AgendamentoDTO agendarDoacao(AgendamentoCreateDTO dto);
    
    // 2. Triagem Clínica  
    public TriagemDTO realizarTriagem(TriagemCreateDTO dto);
    
    // 3. Validar Aptidão
    public boolean validarAptidaoDoacao(Long triagemId);
    
    // 4. Registrar Doação
    public DoacaoDTO registrarDoacao(DoacaoCreateDTO dto);
    
    // 5. Atualizar Estoque
    public void atualizarEstoque(Long doacaoId);
}
```

#### **3.3 Regras de Negócio Críticas**
```java
// Implementar validações:
- Intervalo entre doações (60 dias homens, 90 dias mulheres)
- Critérios de triagem (peso, pressão, hemoglobina)
- Doenças que impedem doação
- Gestão inteligente de estoque
- Alertas de estoque crítico
```

### **Prioridade 4: Sistema de Suporte**

#### **3.4 Entidades de Sistema**
```java
// Implementar:
1. ConfiguracaoSistema   + ConfigController
2. Notificacao          + NotificacaoController  
3. LogAuditoriaLgpd     + AuditoriaController
```

#### **3.5 Funcionalidades Avançadas**
```java
@Service
public class NotificacaoService {
    public void alertarEstoqueCritico(String tipoSanguineo);
    public void notificarValidacaoMedica(Long doadorId);
    public void enviarLembreteAgendamento(Long agendamentoId);
}

@Service
public class AuditoriaService {
    public void registrarAcesso(String tabela, Long registroId, String finalidade);
    public List<LogAuditoriaLgpd> relatorioAcessoDoador(Long doadorId);
}
```

---

## 🧪 FASE 4: Qualidade e Produção (2-3 semanas)

### **Prioridade 5: Testes e Qualidade**

#### **4.1 Testes Automatizados**
```java
// Implementar:
@SpringBootTest
public class DoadorControllerTest {
    @Test void deveCriarDoadorComSucesso();
    @Test void naoDeveCriarDoadorComCpfDuplicado();
    @Test void deveValidarIdadeMinima();
}

@DataJpaTest  
public class DoadorRepositoryTest {
    @Test void deveEncontrarDoadorPorTipoSanguineo();
    @Test void deveBuscarAptosParaDoacao();
}

@MockitoTest
public class ProcessoDoacaoServiceTest {
    @Test void deveRealizarWorkflowCompletoDoacao();
}
```

**Cobertura de Testes:**
- [ ] Unit Tests (Services, Repositories)
- [ ] Integration Tests (Controllers)
- [ ] E2E Tests (Workflow completo)
- [ ] Performance Tests (Carga)

#### **4.2 Documentação API Completa**
```java
// Melhorar documentação Swagger:
- Todos os endpoints documentados
- Exemplos reais de JSON
- Códigos de erro específicos  
- Schemas completos dos DTOs
```

#### **4.3 Configurações de Produção**
```properties
# application-prod.properties
spring.profiles.active=prod
spring.datasource.url=${DATABASE_URL}
logging.level.com.faculdade=WARN
springdoc.swagger-ui.enabled=false  # Desabilitar em prod

# application-dev.properties  
spring.profiles.active=dev
logging.level.com.faculdade=DEBUG
springdoc.swagger-ui.enabled=true
```

### **Prioridade 6: Segurança e Performance**

#### **4.4 Segurança Avançada**
```java
@Configuration
public class SecurityConfig {
    // CORS configurado
    // Rate limiting
    // Validação de inputs
    // Sanitização de dados
    // Logs de segurança
}
```

#### **4.5 Performance e Cache**
```java
@Service
public class EstoqueService {
    @Cacheable("estoque-critico")
    public List<EstoqueSangue> buscarEstoqueCritico();
    
    @CacheEvict("estoque-critico")  
    public void atualizarEstoque(Long estoqueId);
}
```

---

## 🚀 FASE 5: Deploy e Monitoramento (1-2 semanas)

### **Prioridade 7: Preparação para Produção**

#### **5.1 Containerização**
```dockerfile
# Dockerfile
FROM openjdk:21-jdk-slim
COPY target/doesangue-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

#### **5.2 CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy DoeSangue
on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: ./mvnw test
  deploy:
    runs-on: ubuntu-latest  
    steps:
      - run: docker build -t doesangue .
      - run: docker push $REGISTRY/doesangue
```

#### **5.3 Monitoramento**
```java
// Métricas e Health Checks
@Component
public class HealthIndicator implements HealthIndicator {
    public Health health() {
        // Verificar database
        // Verificar serviços externos
        // Verificar estoque crítico
    }
}
```

---

## 📅 Cronograma Detalhado

### **Semanas 1-2: APIs Base**
- **Semana 1:** Auth + DTOs + UserController
- **Semana 2:** DoadorController + HemocentroController + Swagger completo

### **Semanas 3-5: Regras de Negócio**  
- **Semana 3:** Services + Validações + Repositories
- **Semana 4:** Controllers restantes + Testes unitários
- **Semana 5:** Integração + Documentação

### **Semanas 6-9: Processo de Doação**
- **Semana 6:** Entidades FASE 2 (Triagem + Agendamento)
- **Semana 7:** Doacao + EstoqueSangue + Workflow
- **Semana 8:** Sistema de Suporte (Config + Notificação + Auditoria)
- **Semana 9:** Integração + Testes E2E

### **Semanas 10-12: Produção**
- **Semana 10:** Testes completos + Performance
- **Semana 11:** Segurança + Deploy + CI/CD  
- **Semana 12:** Monitoramento + Documentação final

---

## 🎯 Entregáveis por FASE

### **FASE 2 (APIs Base):**
- [ ] 6 Controllers REST funcionais
- [ ] Sistema de autenticação JWT
- [ ] 15+ DTOs documentados
- [ ] Swagger UI completo
- [ ] Testes unitários básicos

### **FASE 3 (Processo Doação):**
- [ ] Workflow completo de doação
- [ ] 4 entidades novas implementadas
- [ ] Sistema de notificações
- [ ] Auditoria LGPD funcional
- [ ] Dashboard de estoque

### **FASE 4 (Qualidade):**
- [ ] Cobertura de testes >80%
- [ ] Performance otimizada
- [ ] Segurança hardened
- [ ] Documentação completa

### **FASE 5 (Produção):**
- [ ] Deploy automatizado
- [ ] Monitoramento ativo
- [ ] Backup configurado
- [ ] Logs estruturados

---

## 🚨 Riscos e Mitigações

### **Riscos Técnicos:**
- **Performance do Banco:** Implementar índices e cache
- **Segurança JWT:** Configurar expiração e refresh
- **Integridade de Dados:** Validações rigorosas + constraints

### **Riscos de Negócio:**
- **Regras Complexas:** Validar com especialistas médicos
- **LGPD Compliance:** Auditoria externa das implementações
- **Escalabilidade:** Projetar para crescimento futuro

---

## 💡 Próximas Ações Imediatas

### **Esta Semana (27 Ago - 2 Set):**
1. **Implementar AuthController e JWT**
2. **Criar DTOs base (User, Doador, Hemocentro)**
3. **Configurar Spring Security**
4. **Testar Swagger com endpoints reais**

### **Próxima Semana (3-9 Set):**
1. **Implementar UserController completo**
2. **Implementar DoadorController**  
3. **Criar Services com validações**
4. **Testes de integração iniciais**

---

**🎯 Objetivo Final:** Sistema DoeSangue completo, seguro, escalável e pronto para produção, atendendo todos os requisitos de um hemocentro moderno com compliance LGPD total.
