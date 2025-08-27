# 📚 Documentação Completa das Entidades - Sistema DoeSangue

**Versão:** v2.0  
**Data:** 27 de Agosto de 2025  
**Desenvolvedor:** Dev Team

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Agregados de Domínio](#agregados-de-domínio)
3. [Entidades Detalhadas](#entidades-detalhadas)
4. [Enums e Value Objects](#enums-e-value-objects)
5. [Anotações JPA Explicadas](#anotações-jpa-explicadas)
6. [Relacionamentos e Estratégias](#relacionamentos-e-estratégias)
7. [Padrões de Design](#padrões-de-design)
8. [Guia de Boas Práticas](#guia-de-boas-práticas)

---

## 🎯 Visão Geral do Sistema

O Sistema DoeSangue é arquitetado em **4 agregados principais** seguindo padrões DDD (Domain-Driven Design), com **17 entidades** que cobrem todo o ciclo de doação de sangue.

### **📊 Estatísticas do Sistema:**
- **17 Entidades JPA** mapeadas
- **4 Agregados** de domínio
- **6 Enums** para type safety
- **100% Cobertura** do schema SQL
- **Multi-setor** e **Workflow médico** implementados

### **🏗️ Arquitetura Geral:**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   INSTITUTIONAL │    │      DONOR      │    │ DONATION_PROCESS│    │ SYSTEM_SUPPORT  │
│                 │    │                 │    │                 │    │                 │
│ • Hemocentro    │    │ • Doador        │    │ • TriagemClinica│    │ • ConfigSistema │
│ • User          │    │ • TipoSanguineo │    │ • Agendamento   │    │ • Notificacao   │
│ • UserRole      │    │ • DoencaEspecif │    │ • Doacao        │    │ • LogAuditoria  │
│ • SetorAtuacao  │    │ • DoadorDoenca  │    │ • EstoqueSangue │    │                 │
│ • UserSetor     │    │ • ConsentLGPD   │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🏢 Agregados de Domínio

### **1. Agregado INSTITUTIONAL** 
**Responsabilidade:** Gestão de usuários, hemocentros e estrutura organizacional

```java
Hemocentro (Aggregate Root)
├── User (Entity)
│   └── UserSetor (Association Entity)
├── UserRole (Entity)  
└── SetorAtuacao (Entity)
```

### **2. Agregado DONOR**
**Responsabilidade:** Gestão de doadores, tipos sanguíneos e histórico médico

```java
Doador (Aggregate Root)
├── TipoSanguineo (Entity)
├── DoadorDoenca (Association Entity)
├── DoencaEspecifica (Entity)
└── ConsentimentoLgpd (Entity)
```

### **3. Agregado DONATION_PROCESS**
**Responsabilidade:** Processo completo de doação desde agendamento até estoque

```java
Doacao (Aggregate Root)
├── Agendamento (Entity)
├── TriagemClinica (Entity)
└── EstoqueSangue (Entity)
```

### **4. Agregado SYSTEM_SUPPORT**
**Responsabilidade:** Configurações, notificações e auditoria

```java
ConfiguracaoSistema (Aggregate Root)
├── Notificacao (Entity)
└── LogAuditoriaLgpd (Entity)
```

---

## 🏛️ Entidades Detalhadas

### **AGREGADO INSTITUTIONAL** 🏢

---

#### **1. Hemocentro** - 🏥 Instituições de Saúde

```java
@Entity
@Table(name = "HEMOCENTROS")
public class Hemocentro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_HEMOCENTRO")
    private Long idHemocentro;
    // ... demais campos
}
```

##### **📊 Estrutura Completa:**

| **Categoria** | **Campo** | **Tipo** | **Constraint** | **Descrição** |
|---------------|-----------|----------|----------------|---------------|
| **Identificação** | `codigoHemocentro` | `String(20)` | `UNIQUE, NOT NULL` | Código oficial ANVISA/MS |
| | `nomeHemocentro` | `String(100)` | `NOT NULL` | Nome institucional |
| | `razaoSocial` | `String(100)` | | Razão social da entidade |
| | `cnpj` | `String(14)` | `UNIQUE` | CNPJ da instituição |
| **Classificação** | `tipoHemocentro` | `String(30)` | `NOT NULL` | COORDENADOR/REGIONAL/LOCAL |
| | `nivelAtencao` | `String(20)` | | PRIMARIO/MEDIO/ALTO |
| **Endereço** | `logradouro` | `String(100)` | `NOT NULL` | Endereço completo |
| | `numero` | `String(10)` | `NOT NULL` | Número do endereço |
| | `cidade` | `String(50)` | `NOT NULL` | Cidade |
| | `estado` | `String(2)` | `NOT NULL` | UF |
| | `cep` | `String(10)` | `NOT NULL` | CEP |
| **Contatos** | `telefonePrincipal` | `String(15)` | `NOT NULL` | Telefone principal |
| | `emailInstitucional` | `String(100)` | | Email oficial |
| | `siteWeb` | `String(100)` | | Site institucional |
| **Responsabilidade** | `diretorTecnico` | `String(100)` | | Nome do diretor técnico |
| | `crmDiretor` | `String(20)` | | CRM do diretor |
| | `responsavelTecnico` | `String(100)` | | Responsável técnico |
| **Operacional** | `capacidadeColetasDia` | `Integer` | | Doações por dia |
| | `horarioFuncionamento` | `String(100)` | | Ex: "07:00-17:00" |
| | `funcionaFeriados` | `Boolean` | | Funciona em feriados |
| **Licenciamento** | `dataLicenciamento` | `LocalDate` | | Data da licença |
| | `numeroLicenca` | `String(50)` | | Número da licença |
| | `orgaoLicenciador` | `String(50)` | | ANVISA (padrão) |

##### **🎯 Características Especiais:**
- **Hierarquia Institucional:** Suporta rede de hemocentros
- **Compliance Regulatório:** Dados ANVISA completos
- **Gestão Operacional:** Capacidade e horários
- **Responsabilidade Médica:** CRM obrigatório

##### **🔗 Relacionamentos:**
```java
// 1:N com Users (hemocentro principal dos usuários)
@OneToMany(mappedBy = "hemocentroPrincipal")
private List<User> usuarios;

// 1:N com Doadores (hemocentro de cadastro)  
@OneToMany(mappedBy = "hemocentroCadastro")
private List<Doador> doadores;
```

---

#### **2. User** - 👤 Usuários do Sistema

```java
@Entity
@Table(name = "USERS")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "ID_USER")
    private Long idUser;
    // ... demais campos
}
```

##### **📊 Estrutura Completa:**

| **Categoria** | **Campo** | **Tipo** | **Constraint** | **Descrição** |
|---------------|-----------|----------|----------------|---------------|
| **Identificação** | `fullName` | `String(100)` | `NOT NULL` | Nome completo |
| | `cpf` | `String(11)` | `UNIQUE, NOT NULL` | CPF único |
| | `email` | `String(100)` | `UNIQUE, NOT NULL` | Email para login |
| **Segurança** | `senhaHash` | `String(255)` | `NOT NULL` | Senha criptografada |
| **Profissional** | `registroProfissional` | `String(20)` | | CRM, COREN, CRF |
| | `conselhoClasse` | `String(10)` | | CRM, COREN, CRF |
| | `ufRegistro` | `String(2)` | | Estado do registro |
| **Contato** | `telefonePrincipal` | `String(15)` | | Telefone principal |
| | `telefoneSecundario` | `String(15)` | | Telefone secundário |
| **Endereço** | `logradouro` | `String(100)` | | Endereço residencial |
| | `numero` | `String(10)` | | Número |
| | `cidade` | `String(50)` | | Cidade |
| | `estado` | `String(2)` | | UF |
| | `cep` | `String(10)` | | CEP |
| **Sistema** | `contaAtiva` | `Boolean` | | Conta ativa/inativa |
| | `lastLogin` | `LocalDateTime` | | Último acesso |
| **Auditoria** | `createdAt` | `LocalDateTime` | | Data de criação |
| | `updatedAt` | `LocalDateTime` | | Última atualização |

##### **🔗 Relacionamentos:**
```java
// N:1 com UserRole (EAGER - sempre precisa para autorização)
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "ID_ROLE", nullable = false)
private UserRole userRole;

// N:1 com Hemocentro (LAZY - carrega sob demanda)
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_HEMOCENTRO_PRINCIPAL")
private Hemocentro hemocentroPrincipal;

// 1:N com UserSetor (LAZY - pode ser lista grande)
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<UserSetor> setores = new ArrayList<>();
```

##### **🎯 Características Especiais:**
- **Multi-Setor:** Um usuário pode atuar em vários setores
- **Rastreabilidade Profissional:** CRM/COREN obrigatório para médicos
- **Segurança:** Senha hash + auditoria de acesso
- **Flexibilidade:** Endereço e contatos opcionais

---

#### **3. UserRole** - 🔐 Perfis de Acesso

```java
@Entity
@Table(name = "USER_ROLES")
public class UserRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ROLE")
    private Long idRole;
    
    @Column(name = "NOME_ROLE", nullable = false, unique = true, length = 50)
    private String nomeRole;
    
    @Column(name = "NIVEL_ACESSO", nullable = false)
    private Integer nivelAcesso;
    
    @Column(name = "ATIVO", nullable = false)
    private Boolean ativo = true;
}
```

##### **📊 Hierarquia RBAC:**

| **Role** | **Nível** | **Permissões** | **Descrição** |
|----------|-----------|----------------|---------------|
| `ADMINISTRADOR` | 4 | Acesso total | Gestão completa do sistema |
| `MEDICO` | 3 | Validação médica + dados clínicos | Triagem, validação de doenças |
| `ENFERMEIRO` | 3 | Triagem + coleta | Procedimentos de enfermagem |
| `ATENDENTE` | 2 | Cadastro + agendamento | Atendimento ao público |

##### **🎯 Características:**
- **Hierárquico:** Níveis numéricos para fácil comparação
- **Extensível:** Novos roles facilmente adicionados
- **Ativação:** Controle de ativo/inativo
- **Único:** Nome do role único no sistema

---

#### **4. SetorAtuacao** - 🏢 Setores de Trabalho

```java
@Entity
@Table(name = "SETORES_ATUACAO")
public class SetorAtuacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_SETOR")
    private Long idSetor;

    @Column(name = "NOME_SETOR", length = 50, nullable = false, unique = true)
    private String nomeSetor;

    @Column(name = "DESCRICAO", length = 200)
    private String descricao;

    @Column(name = "ATIVO")
    private Boolean ativo = true;
}
```

##### **📋 Setores Padrão:**

| **Setor** | **Descrição** | **Exemplo de Atividade** |
|-----------|---------------|---------------------------|
| `TRIAGEM` | Triagem clínica e entrevista | Avaliação de doadores |
| `COLETA` | Coleta de sangue | Procedimentos de doação |
| `LABORATORIO` | Análises laboratoriais | Testes de sangue |
| `ADMINISTRACAO` | Gestão administrativa | Controle de sistemas |
| `ESTOQUE` | Controle de bolsas | Gestão de inventory |
| `ATENDIMENTO` | Recepção e atendimento | Atendimento ao público |
| `ENFERMAGEM` | Supervisão de enfermagem | Cuidados gerais |
| `DIRECAO_TECNICA` | Direção técnica | Responsabilidade médica |

##### **🎯 Características:**
- **Flexível:** Novos setores facilmente adicionados
- **Único:** Nome do setor único
- **Soft Delete:** Campo ativo para histórico
- **Descritivo:** Descrição opcional para documentação

---

#### **5. UserSetor** - 🔄 Relacionamento Multi-Setor

```java
@Entity
@Table(name = "USER_SETORES", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"ID_USER", "ID_SETOR", "ATIVO"}))
public class UserSetor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_USER_SETOR")
    private Long idUserSetor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USER", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_SETOR", nullable = false)
    private SetorAtuacao setor;

    @Column(name = "IS_SETOR_PRINCIPAL")
    private Boolean setorPrincipal = false;

    @Column(name = "DATA_INICIO")
    private LocalDate dataInicio;

    @Column(name = "DATA_FIM")
    private LocalDate dataFim;

    @Column(name = "OBSERVACOES", length = 255)
    private String observacoes;

    @Column(name = "ATIVO")
    private Boolean ativo = true;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (dataInicio == null) {
            dataInicio = LocalDate.now();
        }
    }
}
```

##### **🎯 Características Avançadas:**

**Multi-Setor Simultâneo:**
```java
// Exemplo: Enfermeira Maria
// TRIAGEM (principal) - manhã
// COLETA (secundário) - tarde  
// EMERGENCIA (eventual) - quando necessário
```

**Controle Temporal:**
- `dataInicio`: Quando começou no setor
- `dataFim`: Quando saiu (para histórico)
- `ativo`: Status atual

**Setor Principal:**
- Apenas um setor pode ser principal por usuário
- Business rule aplicada no service

**Unique Constraint:**
```java
@UniqueConstraint(columnNames = {"ID_USER", "ID_SETOR", "ATIVO"})
// Impede duplicação de usuário no mesmo setor ativo
```

##### **🔗 Relacionamentos:**
```java
// N:1 com User (LAZY - carrega sob demanda)
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_USER", nullable = false)
private User user;

// N:1 com SetorAtuacao (LAZY - carrega sob demanda)  
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_SETOR", nullable = false)
private SetorAtuacao setor;
```

---

### **AGREGADO DONOR** 🩸

---

#### **6. Doador** - 👤 Doadores de Sangue

```java
@Entity
@Table(name = "DOADORES")
public class Doador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DOADOR")
    private Long idDoador;
    // ... campos extensos
}
```

##### **📊 Estrutura Completa:**

| **Categoria** | **Campo** | **Tipo** | **Constraint** | **Descrição** |
|---------------|-----------|----------|----------------|---------------|
| **Identificação** | `fullName` | `String(100)` | `NOT NULL` | Nome completo |
| | `cpf` | `String(11)` | `UNIQUE, NOT NULL` | CPF único |
| | `rg` | `String(20)` | | RG |
| | `orgaoEmissorRg` | `String(10)` | | Órgão emissor |
| | `ufRg` | `String(2)` | | UF do RG |
| | `birthDate` | `LocalDate` | `NOT NULL` | Data de nascimento |
| | `gender` | `String(1)` | `NOT NULL` | M/F/O |
| **Contato** | `email` | `String(100)` | | Email pessoal |
| | `telefonePrincipal` | `String(15)` | | Telefone principal |
| | `telefoneSecundario` | `String(15)` | | Telefone secundário |
| | `preferenciaContato` | `String(20)` | | EMAIL/TELEFONE/SMS/WHATSAPP |
| **Endereço Residencial** | `logradouro` | `String(100)` | | Rua/Av |
| | `numero` | `String(10)` | | Número |
| | `complemento` | `String(50)` | | Apto/Casa |
| | `bairro` | `String(50)` | | Bairro |
| | `cidade` | `String(50)` | | Cidade |
| | `estado` | `String(2)` | | UF |
| | `cep` | `String(10)` | | CEP |
| | `pontoReferencia` | `String(100)` | | Ponto de referência |
| **Endereço Profissional** | `empresa` | `String(100)` | | Nome da empresa |
| | `logradouroTrabalho` | `String(100)` | | Endereço do trabalho |
| | `numeroTrabalho` | `String(10)` | | Número |
| | `bairroTrabalho` | `String(50)` | | Bairro |
| | `cidadeTrabalho` | `String(50)` | | Cidade |
| | `estadoTrabalho` | `String(2)` | | UF |
| | `cepTrabalho` | `String(10)` | | CEP |
| **Dados Médicos** | `tipoSanguineo` | `TipoSanguineo` | `NOT NULL` | Tipo sanguíneo |
| | `pesoKg` | `BigDecimal(5,2)` | | Peso em kg |
| | `alturaCm` | `Integer` | | Altura em cm |
| **Status** | `statusDoador` | `String(20)` | | ATIVO/INATIVO/INAPTO |
| | `primeiraDoacao` | `Boolean` | | Primeira doação |
| | `doadorHabitual` | `Boolean` | | 3+ doações em 2 anos |
| **Compliance LGPD** | `aceitaContatoCampanhas` | `Boolean` | | Campanhas de doação |
| | `aceitaContatoEmergencia` | `Boolean` | | Contato emergencial |
| | `aceitaPesquisasCientificas` | `Boolean` | | Pesquisas científicas |
| **Auditoria** | `createdAt` | `LocalDateTime` | | Data de criação |
| | `updatedAt` | `LocalDateTime` | | Última atualização |
| | `cadastradoPor` | `User` | `NOT NULL` | Usuário que cadastrou |
| | `deletedAt` | `LocalDateTime` | | Soft delete |

##### **🎯 Características Especiais:**

**Endereçamento Dual:**
- Endereço residencial completo
- Endereço profissional opcional
- Flexibilidade para diferentes cenários de contato

**Compliance LGPD:**
```java
@Column(name = "ACEITA_CONTATO_CAMPANHAS")
private Boolean aceitaContatoCampanhas; // Campanhas de doação

@Column(name = "ACEITA_CONTATO_EMERGENCIA")  
private Boolean aceitaContatoEmergencia; // Emergências médicas

@Column(name = "ACEITA_PESQUISAS_CIENTIFICAS")
private Boolean aceitaPesquisasCientificas; // Pesquisas
```

**Dados Médicos Precisos:**
```java
@Column(name = "PESO_KG", precision = 5, scale = 2)
private BigDecimal pesoKg; // Ex: 070.50 kg

@ManyToOne
@JoinColumn(name = "ID_TIPO_SANGUINEO", nullable = false)
private TipoSanguineo tipoSanguineo; // Relacionamento obrigatório
```

##### **🔗 Relacionamentos:**
```java
// N:1 com TipoSanguineo (EAGER - sempre necessário)
@ManyToOne
@JoinColumn(name = "ID_TIPO_SANGUINEO", nullable = false)
private TipoSanguineo tipoSanguineo;

// N:1 com Hemocentro (LAZY - carrega sob demanda)
@ManyToOne
@JoinColumn(name = "ID_HEMOCENTRO_CADASTRO")
private Hemocentro hemocentroCadastro;

// N:1 com User para auditoria (LAZY)
@ManyToOne
@JoinColumn(name = "CADASTRADO_POR", nullable = false)
private User cadastradoPor;

// 1:N com DoadorDoenca (LAZY - pode ser lista grande)
@OneToMany(mappedBy = "doador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<DoadorDoenca> doencas = new ArrayList<>();
```

---

#### **7. TipoSanguineo** - 🧬 Tipos Sanguíneos

```java
@Entity
@Table(name = "TIPOS_SANGUINEOS")
public class TipoSanguineo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TIPO")
    private Long idTipoSanguineo;

    @Column(name = "TIPO_ABO", length = 2, nullable = false)
    private String tipoAbo; // A, B, AB, O

    @Column(name = "FATOR_RH", length = 1, nullable = false)
    private String fatorRh; // +, -

    @Column(name = "DESCRICAO_COMPLETA", length = 5, nullable = false, unique = true)
    private String descricaoCompleta; // A+, O-, etc.

    @Column(name = "PODE_DOAR_PARA", length = 100)
    private String podeDoarPara; // Lista de tipos compatíveis

    @Column(name = "PODE_RECEBER_DE", length = 100)
    private String podeReceberDe; // Lista de tipos compatíveis

    @Column(name = "PREVALENCIA_PERCENTUAL", precision = 5, scale = 2)
    private BigDecimal prevalenciaPercentual; // % na população

    @Column(name = "ATIVO")
    private Boolean ativo;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
```

##### **📊 Tipos Sanguíneos e Compatibilidade:**

| **Tipo** | **Pode Doar Para** | **Pode Receber De** | **Prevalência (%)** |
|----------|-------------------|---------------------|---------------------|
| `O-` | Todos | O- | 6.6% |
| `O+` | O+, A+, B+, AB+ | O-, O+ | 36.0% |
| `A-` | A-, A+, AB-, AB+ | O-, A- | 6.2% |
| `A+` | A+, AB+ | O-, O+, A-, A+ | 34.4% |
| `B-` | B-, B+, AB-, AB+ | O-, B- | 1.4% |
| `B+` | B+, AB+ | O-, O+, B-, B+ | 8.5% |
| `AB-` | AB-, AB+ | O-, A-, B-, AB- | 0.6% |
| `AB+` | AB+ | Todos | 2.5% |

##### **🎯 Características Especiais:**

**Modelagem Científica:**
```java
// Constraints do banco de dados
CHECK (TIPO_ABO IN ('A', 'B', 'AB', 'O'))
CHECK (FATOR_RH IN ('+', '-'))
```

**Business Logic Integrada:**
```java
// Strings permitem lógica flexível
private String podeDoarPara; // "O+,A+,B+,AB+"
private String podeReceberDe; // "O-,O+"

// Dados epidemiológicos para dashboard
private BigDecimal prevalenciaPercentual; // 36.0 para O+
```

**Unique Constraint:**
```java
@Column(unique = true)
private String descricaoCompleta; // Impede duplicação (A+, A+)
```

---

#### **8. DoencaEspecifica** - 🏥 Catálogo de Doenças

```java
@Entity
@Table(name = "DOENCAS_ESPECIFICAS")
public class DoencaEspecifica {
    @Id
    @Column(name = "ID_DOENCA")
    private Integer idDoenca; // ID FIXO para controle estatístico
    
    @Column(name = "NOME_DOENCA", length = 100, nullable = false)
    private String nomeDoenca;
    
    @Column(name = "CATEGORIA", length = 50, nullable = false)
    private String categoria;
    
    @Column(name = "IMPEDE_DOACAO", nullable = false)
    private Boolean impedeDoacao;
    
    @Column(name = "OBSERVACOES", length = 255)
    private String observacoes;
    
    @Column(name = "ATIVO")
    private Boolean ativo = true;
}
```

##### **📋 Categorização por IDs Fixos:**

| **Categoria** | **Range IDs** | **Exemplos** | **Características** |
|---------------|---------------|--------------|-------------------|
| **CARDIOVASCULAR** | 1-10 | Hipertensão (1), Infarto (2) | Doenças do coração |
| **METABOLICA** | 11-20 | Diabetes Tipo 1 (11), Tipo 2 (12) | Distúrbios metabólicos |
| **HEMATOLOGICA** | 21-30 | Anemia (21), Hemofilia (24) | Doenças do sangue |
| **INFECCIOSA** | 31-50 | Hepatite B (31), HIV (33) | Doenças transmissíveis |
| **RESPIRATORIA** | 51-60 | Asma (51), DPOC (52) | Sistema respiratório |
| **NEUROLOGICA** | 61-70 | Epilepsia (61) | Sistema nervoso |
| **AUTOIMUNE** | 71-80 | Lúpus (71) | Doenças autoimunes |
| **PSIQUIATRICA** | 81-90 | Depressão (81) | Saúde mental |
| **OUTRAS** | 91-100 | Câncer (91) | Outras condições |

##### **🎯 Design Estratégico:**

**IDs Fixos para Estatísticas:**
```java
@Id
@Column(name = "ID_DOENCA")
private Integer idDoenca; // SEM @GeneratedValue
```
**Vantagem:** Dashboard pode fazer estatísticas consistentes por doença específica.

**Categorização Flexível:**
```java
@Column(name = "CATEGORIA", length = 50, nullable = false)
private String categoria; // CARDIOVASCULAR, METABOLICA, etc.
```

**Decisão Automática:**
```java
@Column(name = "IMPEDE_DOACAO", nullable = false)
private Boolean impedeDoacao; // true = impede, false = permite com avaliação
```

##### **📊 Exemplos de Doenças:**

```java
// Diabetes Tipo 1 - Impede doação
ID: 11, Nome: "Diabetes Mellitus Tipo 1", Categoria: "METABOLICA", 
Impede: true, Obs: "Impede doação definitivamente"

// Hipertensão - Permite com controle
ID: 1, Nome: "Hipertensão Arterial", Categoria: "CARDIOVASCULAR", 
Impede: false, Obs: "Permitido se controlada sem medicação incompatível"

// HIV - Impede doação
ID: 33, Nome: "HIV/AIDS", Categoria: "INFECCIOSA", 
Impede: true, Obs: "Impede doação definitivamente"
```

---

#### **9. DoadorDoenca** - 🩺 Histórico Médico com Validação

```java
@Entity
@Table(name = "DOADOR_DOENCAS",
       uniqueConstraints = @UniqueConstraint(columnNames = {"ID_DOADOR", "ID_DOENCA"}))
public class DoadorDoenca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DOADOR_DOENCA")
    private Long idDoadorDoenca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOADOR", nullable = false)
    private Doador doador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOENCA", nullable = false)
    private DoencaEspecifica doenca;

    @Column(name = "DATA_DIAGNOSTICO")
    private LocalDate dataDiagnostico;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS_ATUAL", length = 20)
    private StatusDoenca statusAtual = StatusDoenca.ATIVO;

    @Enumerated(EnumType.STRING)
    @Column(name = "ORIGEM_DETECCAO", length = 20, nullable = false)
    private OrigemDeteccao origemDeteccao = OrigemDeteccao.DECLARADA_DOADOR;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROFISSIONAL_DETECTOR")
    private User profissionalDetector;

    @Column(name = "VALIDADO_POR_MEDICO")
    private Boolean validadoPorMedico = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_MEDICO_VALIDADOR")
    private User medicoValidador;

    @Column(name = "DATA_VALIDACAO_MEDICA")
    private LocalDateTime dataValidacaoMedica;

    @Column(name = "OBSERVACOES", length = 255)
    private String observacoes;

    @Column(name = "OBSERVACOES_MEDICAS", length = 500)
    private String observacoesMedicas;

    @Column(name = "CADASTRADO_EM")
    private LocalDateTime cadastradoEm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CADASTRADO_POR", nullable = false)
    private User cadastradoPor;

    @PrePersist
    protected void onCreate() {
        cadastradoEm = LocalDateTime.now();
    }
}
```

##### **🎯 Workflow Médico Híbrido:**

**Cenário 1 - Doador Declara:**
```java
// 1. Doador informa que tem diabetes
DoadorDoenca diabetes = new DoadorDoenca();
diabetes.setOrigemDeteccao(DECLARADA_DOADOR);
diabetes.setValidadoPorMedico(false); // Aguarda validação
diabetes.setCadastradoPor(atendente);

// 2. Médico valida depois
diabetes.setValidadoPorMedico(true);
diabetes.setMedicoValidador(medico);
diabetes.setDataValidacaoMedica(LocalDateTime.now());
```

**Cenário 2 - Médico Detecta:**
```java
// Médico detecta hipertensão durante triagem
DoadorDoenca hipertensao = new DoadorDoenca();
hipertensao.setOrigemDeteccao(DETECTADA_MEDICO);
hipertensao.setProfissionalDetector(medico);
hipertensao.setValidadoPorMedico(true); // Já validado
hipertensao.setMedicoValidador(medico);
```

**Cenário 3 - Exame Laboratorial:**
```java
// Resultado de exame detecta doença
DoadorDoenca hepatite = new DoadorDoenca();
hepatite.setOrigemDeteccao(EXAME_LABORATORIAL);
hepatite.setValidadoPorMedico(false); // Médico deve avaliar resultado
```

##### **📊 Estados da Doença:**

```java
public enum StatusDoenca {
    ATIVO,      // Doença ativa/presente
    CURADO,     // Doença curada/superada  
    CONTROLADO  // Doença controlada com tratamento
}

public enum OrigemDeteccao {
    DECLARADA_DOADOR,      // Doador informou
    DETECTADA_MEDICO,      // Médico detectou
    EXAME_LABORATORIAL     // Resultado de exame
}
```

##### **🔒 Integridade de Dados:**

**Unique Constraint:**
```java
@UniqueConstraint(columnNames = {"ID_DOADOR", "ID_DOENCA"})
// Um doador não pode ter a mesma doença duplicada
```

**Relacionamentos Obrigatórios:**
```java
@JoinColumn(name = "ID_DOADOR", nullable = false)   // Doador obrigatório
@JoinColumn(name = "ID_DOENCA", nullable = false)   // Doença obrigatória  
@JoinColumn(name = "CADASTRADO_POR", nullable = false) // Auditoria obrigatória
```

##### **📈 Rastreabilidade Completa:**

```java
// Quem cadastrou
private User cadastradoPor;          // Usuário que registrou
private LocalDateTime cadastradoEm;  // Quando foi registrado

// Quem detectou (se aplicável)
private User profissionalDetector;   // Médico que detectou

// Quem validou
private User medicoValidador;           // Médico que validou
private LocalDateTime dataValidacaoMedica; // Quando foi validado
private Boolean validadoPorMedico;      // Status de validação
```

---

#### **10. ConsentimentoLgpd** - 🔒 Compliance de Privacidade

```java
@Entity
@Table(name = "CONSENTIMENTOS_LGPD")
public class ConsentimentoLgpd {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONSENTIMENTO")
    private Long idConsentimento;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOADOR", nullable = false)
    private Doador doador;
    
    @Column(name = "TIPO_CONSENTIMENTO", length = 50, nullable = false)
    private String tipoConsentimento; // CADASTRO, CONTATO, PESQUISA
    
    @Column(name = "CONSENTIMENTO_DADO", nullable = false)
    private Boolean consentimentoDado;
    
    @Column(name = "FINALIDADE", length = 255, nullable = false)
    private String finalidade;
    
    @Column(name = "DATA_CONSENTIMENTO")
    private LocalDateTime dataConsentimento;
    
    @Column(name = "DATA_REVOGACAO")
    private LocalDateTime dataRevogacao;
}
```

##### **📋 Tipos de Consentimento:**

| **Tipo** | **Finalidade** | **Exemplo** |
|----------|----------------|-------------|
| `CADASTRO` | Armazenamento de dados pessoais | "Autorizo armazenamento dos meus dados para doação" |
| `CONTATO` | Comunicação para campanhas | "Aceito receber contatos sobre campanhas de doação" |
| `EMERGENCIA` | Contato em emergências | "Autorizo contato em situações de emergência médica" |
| `PESQUISA` | Participação em pesquisas | "Aceito participar de pesquisas científicas" |
| `MARKETING` | Comunicações promocionais | "Aceito receber newsletters e materiais informativos" |

##### **🎯 Características LGPD:**

**Granularidade:**
- Consentimentos específicos por finalidade
- Possibilidade de aceitar uns e recusar outros

**Rastreabilidade:**
```java
private LocalDateTime dataConsentimento; // Quando foi dado
private LocalDateTime dataRevogacao;     // Quando foi revogado (se aplicável)
```

**Flexibilidade:**
```java
private Boolean consentimentoDado; // true = aceito, false = recusado
// Permite histórico de mudanças de opinião
```

---

### 1. **User** - Usuários do Sistema

```java
@Entity
@Table(name="USERS")
public class User {
    // Campos e relacionamentos...
}
```

#### **📊 Campos Principais:**

| Campo | Tipo | Anotação | Descrição |
|-------|------|----------|-----------|
| `idUser` | `Long` | `@Id @GeneratedValue` | PK auto-incremento |
| `fullName` | `String(100)` | `@Column(nullable=false)` | Nome completo obrigatório |
| `cpf` | `String(11)` | `@Column(unique=true)` | CPF único no sistema |
| `email` | `String(100)` | `@Column(unique=true)` | Email único para login |
| `senhaHash` | `String(255)` | `@Column(nullable=false)` | Senha criptografada |

#### **🏥 Dados Profissionais:**

```java
@Column(name = "REGISTRO_PROFISSIONAL", length = 20)
private String registroProfissional; // CRM, COREN, CRF, etc.

@Column(name = "CONSELHO_CLASSE", length = 10) 
private String conselhoClasse; // CRM, COREN, CRF

@Column(name = "UF_REGISTRO", length = 2)
private String ufRegistro; // Estado do registro
```

**💡 Explicação:** Permite rastreabilidade profissional completa, essencial para responsabilidade médica e auditoria.

#### **🏠 Endereço Completo:**

```java
@Column(name = "LOGRADOURO", length = 100)
private String logradouro;
// ... demais campos de endereço
```

**💡 Explicação:** Endereço completo para contato e documentação institucional.

#### **🔗 Relacionamentos:**

```java
// Relacionamento com Role (N:1)
@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "ID_ROLE", nullable = false)
private UserRole userRole;

// Relacionamento com Hemocentro (N:1)
@ManyToOne(fetch = FetchType.LAZY)  
@JoinColumn(name = "ID_HEMOCENTRO_PRINCIPAL")
private Hemocentro hemocentroPrincipal;

// Relacionamento com Setores (1:N) - NOVO FASE 1
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<UserSetor> setores = new ArrayList<>();
```

**🎯 Estratégias de Fetch:**
- **EAGER** para `userRole`: Sempre necessário para autorização
- **LAZY** para `hemocentroPrincipal`: Carregado sob demanda
- **LAZY** para `setores`: Lista pode ser grande, carrega quando necessário

---

### 2. **UserRole** - Perfis de Acesso

```java
@Entity
@Table(name = "USER_ROLES")
public class UserRole {
    // Implementação...
}
```

#### **📊 Estrutura RBAC (Role-Based Access Control):**

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "ID_ROLE")
private Long idRole;

@Column(name = "NOME_ROLE", nullable = false, unique = true, length = 50)
private String nomeRole; // ADMINISTRADOR, MEDICO, ENFERMEIRO, ATENDENTE

@Column(name = "NIVEL_ACESSO", nullable = false)
private Integer nivelAcesso; // 1=Básico, 2=Intermediário, 3=Avançado, 4=Admin

@Column(name = "ATIVO", nullable = false)
private Boolean ativo = true;
```

**💡 Hierarquia de Acesso:**
- **Nível 4 (ADMINISTRADOR):** Acesso total ao sistema
- **Nível 3 (MEDICO/ENFERMEIRO):** Validação médica + dados clínicos
- **Nível 2 (ATENDENTE):** Cadastro básico + agendamentos
- **Nível 1 (Futuro):** Consulta limitada

---

### 3. **Doador** - Doadores de Sangue

```java
@Entity
@Table(name = "DOADORES")
public class Doador {
    // Implementação completa...
}
```

#### **👤 Dados Pessoais Básicos:**

```java
@Column(name = "FULL_NAME", length = 100, nullable = false)
private String fullName;

@Column(name = "CPF", length = 11, nullable = false, unique = true)
private String cpf;

@Column(name = "RG", length = 20)
private String rg;

@Column(name = "BIRTH_DATE", nullable = false)
private LocalDate birthDate;

@Column(name = "GENDER", length = 1, nullable = false)
private String gender; // M, F, O
```

**💡 Constraint Check:** O banco implementa `CHECK (GENDER IN ('M','F','O'))` para validação.

#### **🏠 Sistema de Endereços Dual:**

```java
// Endereço Residencial
@Column(name = "LOGRADOURO", length = 100)
private String logradouro;
// ... campos residenciais

// Endereço Profissional  
@Column(name = "LOGRADOURO_TRABALHO", length = 100)
private String logradouroTrabalho;
// ... campos profissionais
```

**💡 Design Avançado:** Suporta dois endereços completos para maior flexibilidade de contato.

#### **🩸 Dados Médicos:**

```java
@ManyToOne
@JoinColumn(name = "ID_TIPO_SANGUINEO", nullable = false)
private TipoSanguineo tipoSanguineo;

@Column(name = "PESO_KG", precision = 5, scale = 2)
private BigDecimal pesoKg; // Precisão decimal para peso

@Column(name = "ALTURA_CM")
private Integer alturaCm;
```

**💡 Tipos de Dados:** `BigDecimal` para peso garante precisão em cálculos médicos.

#### **🔒 Compliance LGPD:**

```java
@Column(name = "ACEITA_CONTATO_CAMPANHAS")
private Boolean aceitaContatoCampanhas;

@Column(name = "ACEITA_CONTATO_EMERGENCIA") 
private Boolean aceitaContatoEmergencia;

@Column(name = "ACEITA_PESQUISAS_CIENTIFICAS")
private Boolean aceitaPesquisasCientificas;
```

**💡 Privacidade:** Consentimentos granulares para diferentes finalidades.

#### **🔗 Relacionamentos:**

```java
// Relacionamento com Doenças (1:N) - NOVO FASE 1
@OneToMany(mappedBy = "doador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<DoadorDoenca> doencas = new ArrayList<>();

// Auditoria
@ManyToOne
@JoinColumn(name = "CADASTRADO_POR", nullable = false)
private User cadastradoPor;

// Soft Delete
@Column(name = "DELETED_AT")
private LocalDateTime deletedAt;
```

**💡 Cascade ALL:** Doenças são removidas automaticamente se doador for excluído.

---

### 4. **TipoSanguineo** - Tipos Sanguíneos ABO/RH

```java
@Entity
@Table(name = "TIPOS_SANGUINEOS")
public class TipoSanguineo {
    // Implementação científica...
}
```

#### **🧬 Modelagem Científica:**

```java
@Column(name = "TIPO_ABO", length = 2, nullable = false)
private String tipoAbo; // A, B, AB, O

@Column(name = "FATOR_RH", length = 1, nullable = false)  
private String fatorRh; // +, -

@Column(name = "DESCRICAO_COMPLETA", length = 5, nullable = false, unique = true)
private String descricaoCompleta; // A+, O-, etc.
```

**💡 Constraint:** Banco valida `CHECK (TIPO_ABO IN ('A', 'B', 'AB', 'O'))` e `CHECK (FATOR_RH IN ('+', '-'))`.

#### **🔄 Regras de Compatibilidade:**

```java
@Column(name = "PODE_DOAR_PARA", length = 100)
private String podeDoarPara; // "O+,A+,B+,AB+"

@Column(name = "PODE_RECEBER_DE", length = 100) 
private String podeReceberDe; // "O-,O+"

@Column(name = "PREVALENCIA_PERCENTUAL", precision = 5, scale = 2)
private BigDecimal prevalenciaPercentual; // 36.0 para O+
```

**💡 Business Logic:** Strings permitem lógica flexível de compatibilidade + dados epidemiológicos.

---

### 5. **Hemocentro** - Instituições de Saúde

```java
@Entity
@Table(name = "HEMOCENTROS")
public class Hemocentro {
    // Implementação institucional...
}
```

#### **🏥 Dados Institucionais:**

```java
@Column(name = "CODIGO_HEMOCENTRO", length = 20, nullable = false, unique = true)
private String codigoHemocentro; // Código ANVISA/MS

@Column(name = "CNPJ", length = 14, unique = true)
private String cnpj;

@Column(name = "TIPO_HEMOCENTRO", length = 30, nullable = false)
private String tipoHemocentro; // COORDENADOR, REGIONAL, LOCAL, NUCLEO
```

**💡 Classificação:** Suporta hierarquia completa da rede de hemocentros.

#### **👨‍⚕️ Responsabilidade Técnica:**

```java
@Column(name = "DIRETOR_TECNICO", length = 100)
private String diretorTecnico;

@Column(name = "CRM_DIRETOR", length = 20)
private String crmDiretor;

@Column(name = "RESPONSAVEL_TECNICO", length = 100)
private String responsavelTecnico;
```

**💡 Compliance:** Atende exigências legais de responsabilidade médica.

#### **⚙️ Dados Operacionais:**

```java
@Column(name = "CAPACIDADE_COLETAS_DIA")
private Integer capacidadeColetasDia;

@Column(name = "HORARIO_FUNCIONAMENTO", length = 100)
private String horarioFuncionamento; // "07:00-17:00"

@Column(name = "FUNCIONA_FERIADOS")
private Boolean funcionaFeriados;
```

**💡 Planejamento:** Suporta gestão operacional e agendamentos.

---

## 🚀 Entidades FASE 1 (Implementadas)

### 6. **SetorAtuacao** - Setores de Trabalho

```java
@Entity
@Table(name = "SETORES_ATUACAO")
public class SetorAtuacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_SETOR")
    private Long idSetor;

    @Column(name = "NOME_SETOR", length = 50, nullable = false, unique = true)
    private String nomeSetor;

    @Column(name = "DESCRICAO", length = 200)
    private String descricao;

    @Column(name = "ATIVO")
    private Boolean ativo = true;
}
```

#### **🎯 Características:**

- **Unique Constraint:** `nomeSetor` único previne duplicatas
- **Soft Delete:** Campo `ativo` para desativação sem perder histórico
- **Descrição Opcional:** Flexibilidade para documentar cada setor

#### **📋 Setores Padrão:**
1. **TRIAGEM** - Triagem clínica e entrevista
2. **COLETA** - Coleta de sangue e procedimentos
3. **LABORATORIO** - Análises laboratoriais
4. **ADMINISTRACAO** - Gestão administrativa
5. **ESTOQUE** - Controle de bolsas
6. **ATENDIMENTO** - Recepção e atendimento
7. **ENFERMAGEM** - Supervisão de enfermagem
8. **DIRECAO_TECNICA** - Direção técnica

---

### 7. **UserSetor** - Relacionamento Multi-Setor

```java
@Entity
@Table(name = "USER_SETORES", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"ID_USER", "ID_SETOR", "ATIVO"}))
public class UserSetor {
    // Implementação N:N...
}
```

#### **🔗 Relacionamentos N:N:**

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_USER", nullable = false)
private User user;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_SETOR", nullable = false)
private SetorAtuacao setor;
```

**💡 Fetch LAZY:** Otimização para não carregar objetos relacionados desnecessariamente.

#### **⭐ Setor Principal:**

```java
@Column(name = "IS_SETOR_PRINCIPAL")
private Boolean setorPrincipal = false;
```

**💡 Business Rule:** Apenas um setor pode ser principal por usuário ativo.

#### **📅 Controle Temporal:**

```java
@Column(name = "DATA_INICIO")
private LocalDate dataInicio;

@Column(name = "DATA_FIM")
private LocalDate dataFim;

@Column(name = "ATIVO")
private Boolean ativo = true;
```

**💡 Histórico:** Permite rastrear períodos de atuação em cada setor.

#### **🔒 Unique Constraint:**

```java
@UniqueConstraint(columnNames = {"ID_USER", "ID_SETOR", "ATIVO"})
```

**💡 Integridade:** Impede que usuário tenha vínculo duplicado ativo com mesmo setor.

#### **🕰️ Auto-Preenchimento:**

```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    if (dataInicio == null) {
        dataInicio = LocalDate.now();
    }
}
```

**💡 JPA Lifecycle:** `@PrePersist` executa antes de salvar no banco.

---

### 8. **DoencaEspecifica** - Catálogo de Doenças

```java
@Entity
@Table(name = "DOENCAS_ESPECIFICAS")
public class DoencaEspecifica {
    @Id
    @Column(name = "ID_DOENCA")
    private Integer idDoenca; // ID FIXO para controle estatístico
    
    // Campos...
}
```

#### **🔢 ID Fixo Estratégico:**

**💡 Design Decision:** `@Id` sem `@GeneratedValue` permite IDs fixos para controle estatístico:

- **IDs 1-10:** Doenças cardiovasculares
- **IDs 11-20:** Doenças metabólicas/endócrinas  
- **IDs 21-30:** Doenças hematológicas
- **IDs 31-50:** Doenças infecciosas
- **IDs 51-60:** Doenças respiratórias
- **IDs 61-70:** Doenças neurológicas
- **IDs 71-80:** Doenças autoimunes
- **IDs 81-90:** Doenças psiquiátricas
- **IDs 91-100:** Outras doenças

#### **📊 Categorização:**

```java
@Column(name = "CATEGORIA", length = 50, nullable = false)
private String categoria; // CARDIOVASCULAR, METABOLICA, INFECCIOSA, etc.

@Column(name = "IMPEDE_DOACAO", nullable = false)
private Boolean impedeDoacao; // true = impede doação
```

**💡 Business Logic:** Permite filtros por categoria e decisões automáticas de elegibilidade.

---

### 9. **DoadorDoenca** - Histórico Médico com Validação

```java
@Entity
@Table(name = "DOADOR_DOENCAS",
       uniqueConstraints = @UniqueConstraint(columnNames = {"ID_DOADOR", "ID_DOENCA"}))
public class DoadorDoenca {
    // Implementação complexa...
}
```

#### **🔗 Relacionamentos Principais:**

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_DOADOR", nullable = false)
private Doador doador;

@ManyToOne(fetch = FetchType.LAZY)  
@JoinColumn(name = "ID_DOENCA", nullable = false)
private DoencaEspecifica doenca;
```

#### **📊 Status e Origem:**

```java
@Enumerated(EnumType.STRING)
@Column(name = "STATUS_ATUAL", length = 20)
private StatusDoenca statusAtual = StatusDoenca.ATIVO;

@Enumerated(EnumType.STRING)
@Column(name = "ORIGEM_DETECCAO", length = 20, nullable = false)
private OrigemDeteccao origemDeteccao = OrigemDeteccao.DECLARADA_DOADOR;
```

**💡 Enum Strategy:** `EnumType.STRING` armazena texto legível no banco (vs. ordinais).

#### **👨‍⚕️ Workflow de Validação Médica:**

```java
@Column(name = "VALIDADO_POR_MEDICO")
private Boolean validadoPorMedico = false;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_MEDICO_VALIDADOR")
private User medicoValidador;

@Column(name = "DATA_VALIDACAO_MEDICA")
private LocalDateTime dataValidacaoMedica;
```

**💡 Workflow Híbrido:**
1. **Doador declara** → `validadoPorMedico = false`
2. **Médico valida** → `validadoPorMedico = true` + timestamp
3. **Rastreabilidade completa** preservada

#### **🔒 Unique Constraint:**

```java
@UniqueConstraint(columnNames = {"ID_DOADOR", "ID_DOENCA"})
```

**💡 Integridade:** Um doador não pode ter a mesma doença duplicada.

---

### **AGREGADO DONATION_PROCESS** 🩸

---

#### **11. TriagemClinica** - 🏥 Avaliação Clínica

```java
@Entity
@Table(name = "TRIAGEM_CLINICA")
public class TriagemClinica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_TRIAGEM")
    private Long idTriagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOADOR", nullable = false)
    private Doador doador;

    @Column(name = "DATA_TRIAGEM", nullable = false)
    private LocalDateTime dataTriagem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PROFISSIONAL", nullable = false)
    private User profissional;

    @Column(name = "PESO_KG", precision = 5, scale = 2, nullable = false)
    private BigDecimal pesoKg;

    @Column(name = "PRESSAO_ARTERIAL", length = 20)
    private String pressaoArterial; // "120/80"

    @Column(name = "HEMOGLOBINA", precision = 4, scale = 2)
    private BigDecimal hemoglobina; // g/dL

    @Column(name = "APTO_DOACAO", nullable = false)
    private Boolean aptoDoacao;

    @Column(name = "MOTIVO_INAPTIDAO", length = 255)
    private String motivoInaptidao;

    @Column(name = "OBSERVACOES", length = 500)
    private String observacoes;
}
```

##### **📊 Critérios de Triagem:**

| **Parâmetro** | **Tipo** | **Valores Normais** | **Observações** |
|---------------|----------|-------------------|----------------|
| **Peso** | `BigDecimal(5,2)` | ≥ 50kg | Peso mínimo obrigatório |
| **Pressão Arterial** | `String(20)` | 90/60 - 180/100 | Formato: "120/80" |
| **Hemoglobina** | `BigDecimal(4,2)` | ♂≥13g/dL, ♀≥12g/dL | Valores por gênero |
| **Idade** | Calculado | 16-69 anos | Calculado via birthDate |

##### **🎯 Workflow de Triagem:**

**Processo Completo:**
```java
// 1. Enfermeiro/Médico realiza triagem
TriagemClinica triagem = new TriagemClinica();
triagem.setDoador(doador);
triagem.setProfissional(enfermeiro);
triagem.setPesoKg(new BigDecimal("70.5"));
triagem.setPressaoArterial("120/80");
triagem.setHemoglobina(new BigDecimal("14.2"));

// 2. Sistema avalia critérios automaticamente
boolean aptoIdade = calcularIdade(doador.getBirthDate()) >= 16;
boolean aptoPeso = triagem.getPesoKg().compareTo(new BigDecimal("50")) >= 0;
boolean aptoHemoglobina = validarHemoglobina(triagem.getHemoglobina(), doador.getGender());

// 3. Decisão final
triagem.setAptoDoacao(aptoIdade && aptoPeso && aptoHemoglobina);
if (!triagem.getAptoDoacao()) {
    triagem.setMotivoInaptidao("Hemoglobina abaixo do limite mínimo");
}
```

**Estados Possíveis:**
- `aptoDoacao = true`: Pode prosseguir para doação
- `aptoDoacao = false`: Inapto temporária ou definitivamente

---

#### **12. Agendamento** - 📅 Sistema de Agendas

```java
@Entity
@Table(name = "AGENDAMENTOS")
public class Agendamento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_AGENDAMENTO")
    private Long idAgendamento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOADOR", nullable = false)
    private Doador doador;

    @Column(name = "DATA_AGENDADA", nullable = false)
    private LocalDateTime dataAgendada;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 20)
    private StatusAgendamento status = StatusAgendamento.AGENDADO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "AGENDADO_POR", nullable = false)
    private User agendadoPor;

    @Column(name = "DATA_AGENDAMENTO")
    private LocalDateTime dataAgendamento;

    @Column(name = "OBSERVACOES", length = 255)
    private String observacoes;
}
```

##### **📋 Status do Agendamento:**

```java
public enum StatusAgendamento {
    AGENDADO,       // Agendamento confirmado
    COMPARECEU,     // Doador compareceu
    NAO_COMPARECEU, // Doador faltou
    CANCELADO       // Agendamento cancelado
}
```

##### **🎯 Ciclo de Vida do Agendamento:**

```
AGENDADO → COMPARECEU → [Triagem] → [Doação]
    ↓
CANCELADO
    ↓
NAO_COMPARECEU
```

**Workflow Típico:**
```java
// 1. Atendente agenda doação
Agendamento agendamento = new Agendamento();
agendamento.setDoador(doador);
agendamento.setDataAgendada(LocalDateTime.of(2025, 8, 30, 9, 0)); // 30/08 às 9h
agendamento.setAgendadoPor(atendente);
agendamento.setStatus(AGENDADO);

// 2. No dia do agendamento
if (doadorCompareceu) {
    agendamento.setStatus(COMPARECEU);
    // Prosseguir para triagem
} else {
    agendamento.setStatus(NAO_COMPARECEU);
    // Reagendar se necessário
}
```

---

#### **13. Doacao** - 💉 Registro de Doações

```java
@Entity
@Table(name = "DOACOES")
public class Doacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DOACAO")
    private Long idDoacao;

    @Column(name = "NUMERO_BOLSA", length = 20, nullable = false, unique = true)
    private String numeroBolsa; // Código único da bolsa

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_DOADOR", nullable = false)
    private Doador doador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TRIAGEM", nullable = false)
    private TriagemClinica triagem; // Toda doação precisa de triagem

    @Column(name = "DATA_DOACAO", nullable = false)
    private LocalDate dataDoacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_RESPONSAVEL", nullable = false)
    private User responsavel; // Profissional que conduziu

    @Column(name = "QUANTIDADE_ML", nullable = false)
    private Integer quantidadeMl = 450; // Volume padrão

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS_BOLSA", length = 30)
    private StatusBolsa statusBolsa = StatusBolsa.COLETADA;

    @Column(name = "TEVE_INTERCORRENCIA")
    private Boolean teveIntercorrencia = false;

    @Column(name = "OBSERVACOES_INTERCORRENCIA", length = 500)
    private String observacoesIntercorrencia;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;
}
```

##### **📋 Status da Bolsa:**

```java
public enum StatusBolsa {
    COLETADA,     // Sangue coletado
    APROVADA,     // Aprovada nos testes
    REJEITADA,    // Rejeitada nos testes
    TRANSFUNDIDA  // Utilizada em transfusão
}
```

##### **🎯 Workflow da Doação:**

```
Triagem APROVADA → Coleta → Testes → Estoque → Transfusão
                     ↓        ↓        ↓         ↓
                 COLETADA → APROVADA → Disponível → TRANSFUNDIDA
                            ↓
                         REJEITADA → Descarte
```

**Processo Completo:**
```java
// 1. Após triagem aprovada
Doacao doacao = new Doacao();
doacao.setDoador(doador);
doacao.setTriagem(triagemAprovada);
doacao.setNumeroBolsa(gerarNumeroBolsa()); // Ex: "DOA-2025-001234"
doacao.setResponsavel(enfermeiro);
doacao.setQuantidadeMl(450); // Volume padrão
doacao.setStatusBolsa(COLETADA);

// 2. Se houve intercorrência
if (houveProblema) {
    doacao.setTeveIntercorrencia(true);
    doacao.setObservacoesIntercorrencia("Doador sentiu mal-estar durante coleta");
}

// 3. Após testes laboratoriais
if (testesAprovados) {
    doacao.setStatusBolsa(APROVADA);
    // Adicionar ao estoque
} else {
    doacao.setStatusBolsa(REJEITADA);
    // Descartar bolsa
}
```

##### **🔗 Relacionamentos Críticos:**

```java
// Triagem obrigatória antes da doação
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_TRIAGEM", nullable = false)
private TriagemClinica triagem;

// Rastreabilidade do responsável
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_RESPONSAVEL", nullable = false)
private User responsavel;
```

**Business Rule:** Toda doação DEVE ter uma triagem aprovada associada.

---

#### **14. EstoqueSangue** - 📦 Controle de Inventory

```java
@Entity
@Table(name = "ESTOQUE_SANGUE")
public class EstoqueSangue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ESTOQUE")
    private Long idEstoque;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_TIPO_SANGUINEO", nullable = false)
    private TipoSanguineo tipoSanguineo;

    @Column(name = "QUANTIDADE_BOLSAS", nullable = false)
    private Integer quantidadeBolsas = 0;

    @Column(name = "NIVEL_MINIMO")
    private Integer nivelMinimo = 10;

    @Column(name = "NIVEL_IDEAL")
    private Integer nivelIdeal = 30;

    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS_ESTOQUE", length = 20)
    private StatusEstoque statusEstoque = StatusEstoque.ADEQUADO;

    @Column(name = "ULTIMA_ATUALIZACAO")
    private LocalDateTime ultimaAtualizacao;
}
```

##### **📊 Níveis de Estoque:**

```java
public enum StatusEstoque {
    CRITICO,  // < nível mínimo
    BAIXO,    // >= mínimo e < 50% do ideal
    ADEQUADO, // >= 50% do ideal e < ideal
    ALTO      // >= ideal
}
```

##### **🎯 Gestão Inteligente:**

**Cálculo Automático de Status:**
```java
public StatusEstoque calcularStatus() {
    if (quantidadeBolsas < nivelMinimo) {
        return CRITICO;
    } else if (quantidadeBolsas < (nivelIdeal * 0.5)) {
        return BAIXO;
    } else if (quantidadeBolsas < nivelIdeal) {
        return ADEQUADO;
    } else {
        return ALTO;
    }
}
```

**Dashboard de Estoque:**
```java
// Exemplo de estoque por tipo sanguíneo
O- : 5 bolsas  (CRITICO - Doador universal!)
O+ : 45 bolsas (ALTO - Tipo mais comum)
A+ : 15 bolsas (ADEQUADO)
B- : 2 bolsas  (CRITICO - Tipo raro!)
AB+: 25 bolsas (ADEQUADO - Receptor universal)
```

**Priorização por Impacto:**
```java
// O- e B- críticos são mais urgentes que outros tipos
// Baseado na compatibilidade e raridade
```

---

### **AGREGADO SYSTEM_SUPPORT** ⚙️

---

#### **15. ConfiguracaoSistema** - ⚙️ Configurações Dinâmicas

```java
@Entity
@Table(name = "CONFIGURACOES_SISTEMA")
public class ConfiguracaoSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CONFIG")
    private Long idConfig;

    @Column(name = "CHAVE", length = 100, nullable = false, unique = true)
    private String chave;

    @Column(name = "VALOR", length = 500, nullable = false)
    private String valor;

    @Column(name = "DESCRICAO", length = 255)
    private String descricao;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
```

##### **📋 Configurações Típicas:**

| **Chave** | **Valor** | **Descrição** |
|-----------|-----------|---------------|
| `SISTEMA_NOME` | "HemoGest MVP" | Nome do sistema |
| `HEMOCENTRO_NOME` | "Hemocentro Regional" | Nome do hemocentro |
| `VOLUME_PADRAO_DOACAO` | "450" | Volume padrão em ML |
| `IDADE_MINIMA_DOACAO` | "16" | Idade mínima para doação |
| `IDADE_MAXIMA_DOACAO` | "69" | Idade máxima para doação |
| `PESO_MINIMO_DOACAO` | "50" | Peso mínimo em KG |
| `INTERVALO_DOACAO_HOMENS` | "60" | Dias entre doações (homens) |
| `INTERVALO_DOACAO_MULHERES` | "90" | Dias entre doações (mulheres) |
| `HEMOGLOBINA_MIN_HOMENS` | "13.0" | g/dL mínimo homens |
| `HEMOGLOBINA_MIN_MULHERES` | "12.0" | g/dL mínimo mulheres |

##### **🎯 Vantagens:**
- **Flexibilidade:** Alterar regras sem redeploy
- **Auditoria:** Controle de quando foi alterado
- **Centralização:** Todas as configs em um lugar
- **Tipagem:** Conversão automática de string para tipo necessário

**Exemplo de Uso:**
```java
@Service
public class ConfigService {
    
    public Integer getIdadeMinimaDoacao() {
        String valor = configRepository.findByChave("IDADE_MINIMA_DOACAO").getValor();
        return Integer.parseInt(valor);
    }
    
    public BigDecimal getPesoMinimoDoacao() {
        String valor = configRepository.findByChave("PESO_MINIMO_DOACAO").getValor();
        return new BigDecimal(valor);
    }
}
```

---

#### **16. Notificacao** - 🔔 Sistema de Alertas

```java
@Entity
@Table(name = "NOTIFICACOES")
public class Notificacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_NOTIFICACAO")
    private Long idNotificacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO")
    private User usuario; // NULL = notificação geral

    @Column(name = "TITULO", length = 100, nullable = false)
    private String titulo;

    @Column(name = "MENSAGEM", length = 500, nullable = false)
    private String mensagem;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO", length = 20)
    private TipoNotificacao tipo = TipoNotificacao.INFO;

    @Column(name = "LIDA")
    private Boolean lida = false;

    @Column(name = "CRIADA_EM")
    private LocalDateTime criadaEm;
}
```

##### **📋 Tipos de Notificação:**

```java
public enum TipoNotificacao {
    INFO,     // Informação geral
    WARNING,  // Aviso/atenção
    ERROR,    // Erro/problema
    SUCCESS   // Sucesso/confirmação
}
```

##### **🎯 Casos de Uso:**

**Notificações de Estoque:**
```java
// Estoque crítico
Notificacao notif = new Notificacao();
notif.setTitulo("Estoque Crítico: O-");
notif.setMensagem("Estoque de O- com apenas 3 bolsas. Ação urgente necessária!");
notif.setTipo(ERROR);
notif.setUsuario(null); // Para todos os usuários
```

**Notificações Médicas:**
```java
// Validação pendente
Notificacao notif = new Notificacao();
notif.setTitulo("Validação Médica Pendente");
notif.setMensagem("5 doenças aguardando validação médica");
notif.setTipo(WARNING);
notif.setUsuario(medico); // Específico para médicos
```

**Notificações de Sistema:**
```java
// Sucesso em operação
Notificacao notif = new Notificacao();
notif.setTitulo("Doação Registrada");
notif.setMensagem("Doação do usuário João Silva registrada com sucesso");
notif.setTipo(SUCCESS);
notif.setUsuario(enfermeiro);
```

---

#### **17. LogAuditoriaLgpd** - 📋 Auditoria LGPD

```java
@Entity
@Table(name = "LOG_AUDITORIA_LGPD")
public class LogAuditoriaLgpd {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_AUDIT")
    private Long idAudit;

    @Column(name = "TABELA", length = 50, nullable = false)
    private String tabela;

    @Column(name = "ID_REGISTRO", nullable = false)
    private Integer idRegistro;

    @Enumerated(EnumType.STRING)
    @Column(name = "OPERACAO", length = 20, nullable = false)
    private TipoOperacao operacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", nullable = false)
    private User usuario;

    @Column(name = "IP_ORIGEM", length = 45)
    private String ipOrigem;

    @Column(name = "DATA_OPERACAO")
    private LocalDateTime dataOperacao;

    @Column(name = "FINALIDADE_ACESSO", length = 255)
    private String finalidadeAcesso;
}
```

##### **📋 Tipos de Operação:**

```java
public enum TipoOperacao {
    SELECT, // Consulta de dados
    INSERT, // Criação de registro
    UPDATE, // Atualização de dados
    DELETE  // Exclusão de dados
}
```

##### **🎯 Compliance LGPD:**

**Auditoria Automática:**
```java
// Exemplo de log automático
LogAuditoriaLgpd log = new LogAuditoriaLgpd();
log.setTabela("DOADORES");
log.setIdRegistro(doador.getId());
log.setOperacao(SELECT);
log.setUsuario(usuarioLogado);
log.setIpOrigem("192.168.1.100");
log.setDataOperacao(LocalDateTime.now());
log.setFinalidadeAcesso("Consulta para agendamento de doação");
```

**Relatórios de Compliance:**
```java
// Todas as operações em dados de um doador específico
List<LogAuditoriaLgpd> historico = auditRepository.findByTabelaAndIdRegistro("DOADORES", doadorId);

// Acessos por usuário em período
List<LogAuditoriaLgpd> acessos = auditRepository.findByUsuarioAndDataBetween(
    usuario, inicio, fim
);

// Operações por finalidade
List<LogAuditoriaLgpd> campanhas = auditRepository.findByFinalidadeContaining("campanha");
```

**Requisitos LGPD Atendidos:**
- ✅ **Registro de acesso:** Quem, quando, onde, por quê
- ✅ **Finalidade:** Motivo do acesso aos dados
- ✅ **Rastreabilidade:** Histórico completo de operações
- ✅ **Relatórios:** Base para relatórios de conformidade

---

## 🏷️ Anotações JPA Explicadas

### **📊 Anotações de Entidade:**

#### **@Entity**
```java
@Entity
public class User { }
```
**O que faz:** Marca a classe como uma entidade JPA que será mapeada para uma tabela no banco de dados.
**Quando usar:** Sempre que criar uma classe que representa uma tabela.

#### **@Table**
```java
@Table(name = "USERS")
public class User { }
```
**O que faz:** Define o nome da tabela no banco. Se omitido, usa o nome da classe.
**Quando usar:** Quando o nome da tabela for diferente do nome da classe.

#### **@NoArgsConstructor / @AllArgsConstructor (Lombok)**
```java
@NoArgsConstructor  // Cria construtor vazio: User()
@AllArgsConstructor // Cria construtor com todos os campos: User(id, name, email...)
public class User { }
```
**O que faz:** Gera automaticamente construtores durante a compilação.
**Quando usar:** Sempre. JPA precisa do construtor vazio, e o completo facilita testes.

#### **@Getter / @Setter (Lombok)**
```java
@Getter @Setter // Gera todos os getters e setters automaticamente
public class User { }
```
**O que faz:** Cria métodos `getName()`, `setName()`, etc. para todos os campos.
**Quando usar:** Sempre, para evitar código repetitivo.

---

### **🔑 Anotações de Campo/Chave Primária:**

#### **@Id**
```java
@Id
private Long idUser;
```
**O que faz:** Marca o campo como chave primária da tabela.
**Quando usar:** Sempre, toda entidade precisa de uma chave primária.

#### **@GeneratedValue**
```java
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long idUser;
```
**O que faz:** Define como o valor da chave primária será gerado.
- `IDENTITY`: Auto-incremento do banco (recomendado para SQL Server/MySQL)
- `SEQUENCE`: Usa sequência do banco (Oracle/PostgreSQL)
- `AUTO`: JPA escolhe automaticamente
**Quando usar:** Sempre com @Id, exceto quando você define o ID manualmente.

#### **@Column**
```java
@Column(name = "FULL_NAME", length = 100, nullable = false, unique = true)
private String fullName;
```
**O que faz:** Configura como o campo será mapeado para a coluna no banco.
- `name`: Nome da coluna (se diferente do campo)
- `length`: Tamanho máximo (para VARCHAR)
- `nullable`: Se permite NULL (padrão: true)
- `unique`: Se valor deve ser único (padrão: false)
**Quando usar:** Para customizar o mapeamento ou adicionar constraints.

---

### **🔗 Anotações de Relacionamento:**

#### **@ManyToOne** (Muitos para Um)
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "ID_ROLE")
private UserRole userRole;
```
**O que faz:** Define relacionamento N:1. Muitos usuários podem ter o mesmo role.
**Quando usar:** Quando muitas entidades referenciam uma única entidade (FK no lado "many").

#### **@OneToMany** (Um para Muitos)
```java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<UserSetor> setores;
```
**O que faz:** Define relacionamento 1:N. Um usuário pode ter muitos setores.
- `mappedBy`: Nome do campo na entidade filha que referencia esta
- `cascade`: Que operações propagar para filhos
- `fetch`: Quando carregar os filhos
**Quando usar:** Para acessar entidades filhas a partir da entidade pai.

#### **@ManyToMany** (Muitos para Muitos)
```java
@ManyToMany
@JoinTable(name = "USER_ROLES",
    joinColumns = @JoinColumn(name = "user_id"),
    inverseJoinColumns = @JoinColumn(name = "role_id"))
private List<Role> roles;
```
**O que faz:** Define relacionamento N:N através de tabela intermediária.
**Quando usar:** Quando ambas as entidades podem ter múltiplas referências entre si.
**⚠️ Nota:** No nosso projeto, preferimos tabela intermediária explícita (UserSetor) para campos extras.

#### **@JoinColumn**
```java
@JoinColumn(name = "ID_ROLE", nullable = false)
private UserRole userRole;
```
**O que faz:** Define o nome da coluna de chave estrangeira.
**Quando usar:** Em relacionamentos @ManyToOne e @OneToOne para customizar a FK.

---

### **⚡ Estratégias de Fetch (Carregamento):**

#### **FetchType.LAZY**
```java
@ManyToOne(fetch = FetchType.LAZY)
private Hemocentro hemocentro;
```
**O que faz:** Carrega o relacionamento apenas quando acessado (proxy).
**Vantagem:** Performance - não carrega dados desnecessários.
**Desvantagem:** Pode causar LazyInitializationException se sessão estiver fechada.
**Quando usar:** Padrão recomendado, especialmente para relacionamentos grandes.

#### **FetchType.EAGER**
```java
@ManyToOne(fetch = FetchType.EAGER)
private UserRole userRole;
```
**O que faz:** Carrega o relacionamento imediatamente junto com a entidade principal.
**Vantagem:** Dados sempre disponíveis, sem exceções de lazy.
**Desvantagem:** Pode causar problemas de performance e N+1 queries.
**Quando usar:** Apenas para relacionamentos pequenos e sempre necessários.

---

### **🔄 Estratégias de Cascade (Propagação):**

#### **CascadeType.ALL**
```java
@OneToMany(mappedBy = "doador", cascade = CascadeType.ALL)
private List<DoadorDoenca> doencas;
```
**O que faz:** Propaga TODAS as operações (persist, merge, remove, refresh, detach).
**Quando usar:** Relacionamentos pai-filho onde filhos não existem sem o pai.

#### **CascadeType.PERSIST**
```java
@OneToMany(cascade = CascadeType.PERSIST)
private List<UserSetor> setores;
```
**O que faz:** Propaga apenas operações de criação (save).
**Quando usar:** Quando quer salvar filhos automaticamente, mas não deletar.

#### **CascadeType.MERGE**
```java
@OneToMany(cascade = CascadeType.MERGE)
private List<UserSetor> setores;
```
**O que faz:** Propaga apenas operações de atualização.
**Quando usar:** Quando quer atualizar filhos automaticamente.

#### **CascadeType.REMOVE**
```java
@OneToMany(cascade = CascadeType.REMOVE)
private List<UserSetor> setores;
```
**O que faz:** Propaga apenas operações de exclusão.
**Quando usar:** Relacionamentos onde filhos devem ser deletados com o pai.

---

### **🏷️ Anotações de Enum:**

#### **@Enumerated(EnumType.STRING)**
```java
@Enumerated(EnumType.STRING)
@Column(name = "STATUS_ATUAL")
private StatusDoenca statusAtual;
```
**O que faz:** Armazena o nome do enum como texto no banco ('ATIVO', 'CURADO').
**Vantagem:** Legível no banco, estável se reordenar enum.
**Desvantagem:** Ocupa mais espaço.
**Quando usar:** Sempre recomendado para manutenibilidade.

#### **@Enumerated(EnumType.ORDINAL)**
```java
@Enumerated(EnumType.ORDINAL)
private StatusDoenca statusAtual;
```
**O que faz:** Armazena a posição do enum como número (0, 1, 2).
**Vantagem:** Ocupa menos espaço.
**Desvantagem:** Quebra se reordenar enum, ilegível no banco.
**Quando usar:** Evitar, usar apenas se performance for crítica.

---

### **⏰ Anotações de Lifecycle (Ciclo de Vida):**

#### **@PrePersist**
```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
}
```
**O que faz:** Executa método antes de salvar entidade no banco pela primeira vez.
**Quando usar:** Para preencher campos automáticos na criação (timestamps, IDs).

#### **@PreUpdate**
```java
@PreUpdate
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
```
**O que faz:** Executa método antes de atualizar entidade existente.
**Quando usar:** Para atualizar campos automáticos (updatedAt, version).

#### **@PostLoad**
```java
@PostLoad
protected void onLoad() {
    // Lógica após carregar do banco
}
```
**O que faz:** Executa método após carregar entidade do banco.
**Quando usar:** Para processamento ou validação após carregar dados.

#### **@PostPersist**
```java
@PostPersist
protected void afterSave() {
    // Lógica após salvar (já tem ID)
}
```
**O que faz:** Executa método após salvar entidade (já com ID gerado).
**Quando usar:** Para ações que precisam do ID gerado (logs, notificações).

---

### **🔒 Anotações de Constraint (Restrições):**

#### **@UniqueConstraint**
```java
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"ID_USER", "ID_SETOR", "ATIVO"}))
```
**O que faz:** Cria constraint de unicidade composta no banco.
**Quando usar:** Para regras de negócio que envolvem múltiplas colunas.

#### **@Index**
```java
@Table(indexes = @Index(columnList = "cpf, email"))
```
**O que faz:** Cria índices no banco para melhorar performance de consultas.
**Quando usar:** Em campos frequentemente usados em WHERE, ORDER BY, JOIN.

---

### **💡 Dicas de Uso:**

#### **Combinações Comuns:**
```java
// Chave primária padrão
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "ID_USER")
private Long idUser;

// Campo obrigatório único
@Column(name = "CPF", length = 11, nullable = false, unique = true)
private String cpf;

// Relacionamento pai-filho
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
private List<UserSetor> setores = new ArrayList<>();

// Enum como string
@Enumerated(EnumType.STRING)
@Column(name = "STATUS", length = 20)
private StatusDoenca status = StatusDoenca.ATIVO;
```

#### **⚠️ Armadilhas Comuns:**
- **EAGER em relacionamentos grandes** → Performance ruim
- **CASCADE.ALL sem cuidado** → Deleções acidentais  
- **Enum ORDINAL** → Quebra ao reordenar
- **Fetch LAZY sem sessão** → LazyInitializationException
- **Relacionamentos bidirecionais sem mappedBy** → Tabelas extras

---

## 🔗 Relacionamentos e Estratégias

### **1. User ↔ UserSetor ↔ SetorAtuacao (Many-to-Many)**

```
User (1) ←→ (N) UserSetor (N) ←→ (1) SetorAtuacao
```

**Vantagens da Tabela Intermediária:**
- Campos adicionais (data_inicio, setor_principal, observacoes)
- Controle de histórico
- Soft delete independente

### **2. Doador ↔ DoadorDoenca ↔ DoencaEspecifica (Many-to-Many)**

```
Doador (1) ←→ (N) DoadorDoenca (N) ←→ (1) DoencaEspecifica  
```

**Vantagens:**
- Status individual por doador-doença
- Workflow de validação médica
- Rastreabilidade de origem
- Auditoria completa

### **3. User → UserRole (Many-to-One)**

```
User (N) ←→ (1) UserRole
```

**EAGER Loading:** Role sempre necessário para autorização.

### **4. User → Hemocentro (Many-to-One)**

```
User (N) ←→ (1) Hemocentro
```

**LAZY Loading:** Hemocentro carregado sob demanda.

---

## 🎨 Padrões de Design Utilizados

### **1. Domain-Driven Design (DDD)**

- **Entities:** Objetos com identidade única (`User`, `Doador`)
- **Value Objects:** Enums (`StatusDoenca`, `OrigemDeteccao`)
- **Aggregates:** Agrupamentos lógicos de entidades relacionadas

### **2. Repository Pattern**

```java
public interface UserSetorRepository extends JpaRepository<UserSetor, Long> {
    List<UserSetor> findByUserAndAtivoTrue(User user);
    // Métodos específicos do domínio
}
```

### **3. Soft Delete Pattern**

```java
@Column(name = "DELETED_AT")
private LocalDateTime deletedAt; // NULL = ativo, preenchido = deletado

@Column(name = "ATIVO") 
private Boolean ativo = true; // true = ativo, false = inativo
```

### **4. Audit Trail Pattern**

```java
@Column(name = "CREATED_AT")
private LocalDateTime createdAt;

@Column(name = "UPDATED_AT") 
private LocalDateTime updatedAt;

@ManyToOne
@JoinColumn(name = "CADASTRADO_POR")
private User cadastradoPor;
```

### **5. State Machine Pattern**

```java
// Workflow: DECLARADA_DOADOR → VALIDAÇÃO_PENDENTE → VALIDADA
public enum StatusDoenca {
    ATIVO, CURADO, CONTROLADO
}

public enum OrigemDeteccao {
    DECLARADA_DOADOR, DETECTADA_MEDICO, EXAME_LABORATORIAL
}
```

---

## 🎯 Boas Práticas Implementadas

### **1. Nomeação Consistente:**
- Entidades em PascalCase (`UserSetor`)
- Campos em camelCase (`setorPrincipal`)
- Tabelas em UPPER_SNAKE_CASE (`USER_SETORES`)
- Colunas em UPPER_SNAKE_CASE (`IS_SETOR_PRINCIPAL`)

### **2. Tipos de Dados Apropriados:**
- `BigDecimal` para valores monetários/precisão
- `LocalDateTime` para timestamps
- `LocalDate` para datas sem horário
- `Boolean` para flags (não primitive boolean)

### **3. Constraints de Integridade:**
- `@UniqueConstraint` para regras de negócio
- `nullable = false` para campos obrigatórios
- `unique = true` para valores únicos

### **4. Performance:**
- Fetch LAZY por padrão
- Fetch EAGER apenas quando necessário
- Índices implícitos em FKs

### **5. Manutenibilidade:**
- Lombok para reduzir boilerplate
- Enums para valores fixos
- Relacionamentos bidirecionais quando necessário

---

## 🏷️ Enums e Value Objects Completos

### **Enums Implementados:**

#### **1. StatusDoenca**
```java
public enum StatusDoenca {
    ATIVO,      // Doença presente/ativa
    CURADO,     // Doença superada/curada
    CONTROLADO  // Doença controlada com tratamento
}
```
**Uso:** Define o estado atual de uma doença no histórico do doador.

#### **2. OrigemDeteccao**
```java
public enum OrigemDeteccao {
    DECLARADA_DOADOR,      // Informado pelo doador
    DETECTADA_MEDICO,      // Detectado por profissional
    EXAME_LABORATORIAL     // Identificado em exame
}
```
**Uso:** Rastreia como uma doença foi identificada no sistema.

#### **3. StatusAgendamento**
```java
public enum StatusAgendamento {
    AGENDADO,       // Confirmado
    COMPARECEU,     // Doador presente
    NAO_COMPARECEU, // Ausência
    CANCELADO       // Cancelamento
}
```
**Uso:** Controla o ciclo de vida dos agendamentos de doação.

#### **4. StatusBolsa**
```java
public enum StatusBolsa {
    COLETADA,     // Sangue coletado
    APROVADA,     // Testes aprovados
    REJEITADA,    // Testes reprovados
    TRANSFUNDIDA  // Utilizada
}
```
**Uso:** Rastreia o estado de cada bolsa de sangue desde coleta até uso.

#### **5. StatusEstoque**
```java
public enum StatusEstoque {
    CRITICO,  // Abaixo do mínimo
    BAIXO,    // Entre mínimo e 50% ideal
    ADEQUADO, // Entre 50% e 100% ideal
    ALTO      // Acima do ideal
}
```
**Uso:** Indica níveis de estoque para gestão inteligente de sangue.

#### **6. TipoNotificacao**
```java
public enum TipoNotificacao {
    INFO,     // Informação
    WARNING,  // Aviso
    ERROR,    // Erro
    SUCCESS   // Sucesso
}
```
**Uso:** Categoriza notificações para apresentação adequada na UI.

#### **7. TipoOperacao**
```java
public enum TipoOperacao {
    SELECT, // Consulta
    INSERT, // Criação
    UPDATE, // Atualização
    DELETE  // Exclusão
}
```
**Uso:** Auditoria LGPD - registra tipo de operação nos dados.

### **🎯 Vantagens dos Enums:**

- **Type Safety:** Compilador impede valores inválidos
- **Legibilidade:** Código autodocumentado
- **Manutenibilidade:** Mudanças centralizadas
- **Performance:** Otimização JVM automática
- **Validação:** Constraint automática no banco

### **🔧 Padrões de Uso:**

#### **Persistência JPA:**
```java
@Enumerated(EnumType.STRING)
@Column(name = "STATUS", length = 20)
private StatusAgendamento status = StatusAgendamento.AGENDADO;
```

#### **Validação de Negócio:**
```java
public void aprovarTriagem() {
    if (this.aptoDoacao) {
        // Pode prosseguir para doação
        agendamento.setStatus(StatusAgendamento.COMPARECEU);
    }
}
```

#### **Consultas Tipadas:**
```java
// Buscar bolsas aprovadas
List<Doacao> aprovadas = doacaoRepository.findByStatusBolsa(StatusBolsa.APROVADA);

// Estoque crítico
List<EstoqueSangue> criticos = estoqueRepository.findByStatusEstoque(StatusEstoque.CRITICO);
```

---

## 📈 Benefícios da Arquitetura

### **✅ Flexibilidade:**
- Multi-setor simultâneo
- Workflow médico híbrido
- Extensibilidade futura

### **✅ Integridade:**
- Constraints de banco
- Validações JPA
- Relacionamentos consistentes

### **✅ Performance:**
- Fetch strategies otimizadas
- Lazy loading inteligente
- Consultas específicas nos repositórios

### **✅ Auditoria:**
- Soft delete preserva histórico
- Timestamps automáticos
- Rastreabilidade de ações

### **✅ Compliance:**
- LGPD (consentimentos granulares)
- Responsabilidade médica
- Auditoria de acesso

---

*Esta documentação fornece uma visão completa da arquitetura de entidades implementada, servindo como referência para desenvolvimento, manutenção e evolução do sistema.*
