# 🎯 Plano de Ação Imediato - Próximos 7 Dias

**Data:** 27 de Agosto de 2025  
**Foco:** Implementação das APIs Base e Autenticação

---

## 📋 Tarefas Prioritárias (Esta Semana)

### **DIA 1-2: Autenticação e Segurança**

#### **✅ Tarefa 1: Implementar JWT Service**
```java
// Criar: src/main/java/com/faculdade/doesangue_api/security/JwtService.java
@Service
public class JwtService {
    public String generateToken(User user);
    public String extractUsername(String token);
    public boolean isTokenValid(String token, User user);
    public boolean isTokenExpired(String token);
}
```

#### **✅ Tarefa 2: Configurar Spring Security**
```java
// Criar: src/main/java/com/faculdade/doesangue_api/security/SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Configurar endpoints públicos/privados
    // Configurar filtro JWT
    // Configurar CORS
}
```

#### **✅ Tarefa 3: Controller de Autenticação**
```java
// Criar: src/main/java/com/faculdade/doesangue_api/controllers/AuthController.java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    @PostMapping("/refresh")  
    @GetMapping("/me")
}
```

### **DIA 3-4: DTOs e Validações**

#### **✅ Tarefa 4: DTOs Base**
```java
// Criar DTOs em: src/main/java/com/faculdade/doesangue_api/dtos/

1. AuthLoginDTO         // Login request
2. AuthResponseDTO      // Login response com token
3. UserDTO              // User para visualização
4. UserCreateDTO        // User para criação
5. UserUpdateDTO        // User para atualização
6. DoadorDTO            // Doador para visualização
7. DoadorCreateDTO      // Doador para criação
8. HemocentroDTO        // Hemocentro básico
```

#### **✅ Tarefa 5: Validações Bean Validation**
```java
// Adicionar anotações nos DTOs:
@NotNull
@NotBlank
@Email
@CPF
@Size(min = 8, max = 100)
@Pattern(regexp = "...")
```

### **DIA 5-6: Controllers Base**

#### **✅ Tarefa 6: UserController Completo**
```java
// Implementar: src/main/java/com/faculdade/doesangue_api/controllers/UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping                 // Listar users paginado
    @GetMapping("/{id}")        // Buscar por ID
    @PostMapping                // Criar user
    @PutMapping("/{id}")        // Atualizar user
    @DeleteMapping("/{id}")     // Soft delete
    @GetMapping("/{id}/setores") // Setores do user
}
```

#### **✅ Tarefa 7: DoadorController Inicial**
```java
// Implementar: DoadorController com endpoints básicos
@RestController
@RequestMapping("/api/doadores")
public class DoadorController {
    @GetMapping                 // Listar doadores
    @GetMapping("/{id}")        // Buscar por ID  
    @PostMapping                // Criar doador
    @PutMapping("/{id}")        // Atualizar doador
}
```

### **DIA 7: Testes e Documentação**

#### **✅ Tarefa 8: Testes Básicos**
```java
// Criar testes em: src/test/java/
1. AuthControllerTest
2. UserControllerTest  
3. JwtServiceTest
```

#### **✅ Tarefa 9: Atualizar Swagger**
```java
// Verificar se documentação está sendo gerada corretamente
// Testar todos os endpoints no Swagger UI
// Adicionar exemplos de JSON nos DTOs
```

---

## 🛠️ Implementação Detalhada

### **1. Estrutura de Pastas a Criar:**
```
src/main/java/com/faculdade/doesangue_api/
├── controllers/
│   ├── AuthController.java
│   ├── UserController.java
│   ├── DoadorController.java
│   └── SystemController.java (já existe)
├── dtos/
│   ├── auth/
│   │   ├── AuthLoginDTO.java
│   │   └── AuthResponseDTO.java
│   ├── user/
│   │   ├── UserDTO.java
│   │   ├── UserCreateDTO.java
│   │   └── UserUpdateDTO.java
│   └── doador/
│       ├── DoadorDTO.java
│       └── DoadorCreateDTO.java
├── security/
│   ├── JwtService.java
│   ├── SecurityConfig.java
│   └── JwtAuthenticationFilter.java
├── services/
│   ├── AuthService.java
│   ├── UserService.java
│   └── DoadorService.java
└── exceptions/
    ├── GlobalExceptionHandler.java
    └── BusinessException.java
```

### **2. Dependências Necessárias (verificar no pom.xml):**
```xml
<!-- JWT já tem -->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
</dependency>

<!-- Security já tem -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Validation já tem -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### **3. Exemplo de DTO com Validação:**
```java
@Schema(description = "Dados para criação de usuário")
public class UserCreateDTO {
    
    @Schema(description = "Nome completo", example = "João Silva Santos")
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String fullName;
    
    @Schema(description = "Email único", example = "joao@email.com")
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    private String email;
    
    @Schema(description = "CPF único", example = "12345678901")
    @NotBlank(message = "CPF é obrigatório")
    @Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos")
    private String cpf;
    
    @Schema(description = "Senha", example = "senha123")
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
    private String senha;
    
    @Schema(description = "ID do role", example = "1")
    @NotNull(message = "Role é obrigatório")
    private Long roleId;
    
    @Schema(description = "ID do hemocentro", example = "1")
    @NotNull(message = "Hemocentro é obrigatório")
    private Long hemocentroId;
}
```

### **4. Exemplo de Controller com Documentação:**
```java
@RestController
@RequestMapping("/api/users")
@Tag(name = "Usuários", description = "Gestão de usuários do sistema")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Operation(
        summary = "Listar usuários",
        description = "Retorna lista paginada de usuários com filtros opcionais"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autorizado"),
        @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    @GetMapping
    public ResponseEntity<Page<UserDTO>> listarUsuarios(
            @Parameter(description = "Página (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Tamanho da página", example = "20")
            @RequestParam(defaultValue = "20") int size,
            
            @Parameter(description = "Filtro por nome", example = "João")
            @RequestParam(required = false) String nome,
            
            @Parameter(description = "Filtro por role", example = "MEDICO")
            @RequestParam(required = false) String role) {
        
        // Implementação...
        return ResponseEntity.ok(userService.listarUsuarios(page, size, nome, role));
    }
}
```

---

## 🧪 Critérios de Aceitação

### **✅ Ao Final da Semana, Deve Estar Funcionando:**

1. **Autenticação:**
   - Login em `/api/auth/login` retorna JWT válido
   - Endpoints protegidos requerem token
   - Swagger UI permite autenticação

2. **APIs Base:**
   - CRUD completo de usuários
   - CRUD básico de doadores
   - Paginação funcionando
   - Validações ativas

3. **Documentação:**
   - Swagger UI com todos os endpoints
   - Exemplos de JSON funcionais
   - Grupos organizados corretamente

4. **Qualidade:**
   - Testes básicos passando
   - Logs estruturados
   - Tratamento de erros

---

## 🎯 Testes de Aceitação

### **Cenários para Testar:**

#### **Autenticação:**
```bash
# 1. Login bem-sucedido
POST /api/auth/login
{
  "email": "admin@doesangue.com",
  "senha": "admin123"
}
# Esperado: 200 + JWT token

# 2. Login com credenciais inválidas  
# Esperado: 401 Unauthorized

# 3. Acesso a endpoint protegido sem token
GET /api/users
# Esperado: 401 Unauthorized

# 4. Acesso com token válido
GET /api/users
Authorization: Bearer <token>
# Esperado: 200 + lista de usuários
```

#### **CRUD de Usuários:**
```bash
# 1. Criar usuário
POST /api/users
{
  "fullName": "Dr. João Silva",
  "email": "joao@hospital.com",
  "cpf": "12345678901",
  "senha": "senha123",
  "roleId": 2,
  "hemocentroId": 1
}
# Esperado: 201 Created

# 2. Buscar usuário criado
GET /api/users/{id}
# Esperado: 200 + dados do usuário

# 3. Listar usuários paginado
GET /api/users?page=0&size=10
# Esperado: 200 + página de usuários
```

---

## 🚀 Comandos para Testar

### **Iniciar Aplicação:**
```bash
cd doesangue_backend
./mvnw spring-boot:run
```

### **Acessar Swagger:**
```
http://localhost:8080/swagger-ui.html
```

### **Health Check:**
```
http://localhost:8080/api/system/health
```

---

## 📞 Próximas Reuniões

### **Checkpoint Diário (Daily):**
- **Horário:** 9h00
- **Duração:** 15min
- **Foco:** Progresso do dia, bloqueios, próximas tarefas

### **Review Semanal (Sexta):**
- **Horário:** 16h00
- **Duração:** 1h
- **Foco:** Demo das funcionalidades, retrospectiva, planejamento

---

**🎯 Meta da Semana:** APIs de autenticação e usuários funcionais, testáveis via Swagger UI, com documentação completa e testes básicos implementados.
