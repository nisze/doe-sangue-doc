# 📚 Guia de Boas Práticas - Controllers REST com Spring Boot

**Finalidade:** Guia educativo para desenvolvimento de controllers REST profissionais  
**Foco:** Anotações, validações e documentação com Swagger

---

## 🎯 Objetivo deste Guia

Este documento apresenta as **melhores práticas** para desenvolvimento de controllers REST no Spring Boot, com foco em:
- **Anotações essenciais** e seu uso correto
- **Validações robustas** com Bean Validation
- **Documentação automática** com Swagger/OpenAPI
- **Padrões de código limpo** e manutenível

---

## 🏗️ Estrutura Básica de um Controller

### **📋 Anotações Principais**

```java
@RestController                    // Marca a classe como controller REST
@RequestMapping("/api/recurso")    // Define o path base
@Tag(name = "Recurso", description = "Operações do recurso")  // Swagger
@Validated                        // Habilita validações nos parâmetros
public class RecursoController {
    // implementação
}
```

### **🔧 Injeção de Dependências**

```java
private final RecursoService service;
private final RecursoMapper mapper;

public RecursoController(RecursoService service, RecursoMapper mapper) {
    this.service = service;
    this.mapper = mapper;
}
```

---

## 🚀 Padrões de Endpoints REST

### **1. 📋 Listagem com Paginação**

```java
@GetMapping
@Operation(
    summary = "Listar recursos com paginação",
    description = "Retorna lista paginada de recursos com filtros opcionais"
)
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
    @ApiResponse(responseCode = "400", description = "Parâmetros inválidos")
})
public ResponseEntity<Page<RecursoDTO>> listar(
    @Parameter(description = "Número da página (0-based)")
    @RequestParam(defaultValue = "0") @Min(0) int page,
    
    @Parameter(description = "Tamanho da página")
    @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size,
    
    @Parameter(description = "Filtros de busca")
    @Valid RecursoFiltroDTO filtros
) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Recurso> recursos = service.buscarComFiltros(filtros, pageable);
    Page<RecursoDTO> dtos = recursos.map(mapper::toDTO);
    return ResponseEntity.ok(dtos);
}
```

### **2. 🔍 Busca por ID**

```java
@GetMapping("/{id}")
@Operation(summary = "Buscar recurso por ID")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Recurso encontrado"),
    @ApiResponse(responseCode = "404", description = "Recurso não encontrado")
})
public ResponseEntity<RecursoDTO> buscarPorId(
    @Parameter(description = "ID do recurso", required = true)
    @PathVariable @Positive Long id
) {
    Recurso recurso = service.buscarPorId(id);
    RecursoDTO dto = mapper.toDTO(recurso);
    return ResponseEntity.ok(dto);
}
```

### **3. ➕ Criação de Recurso**

```java
@PostMapping
@Operation(summary = "Criar novo recurso")
@ApiResponses({
    @ApiResponse(responseCode = "201", description = "Recurso criado com sucesso"),
    @ApiResponse(responseCode = "400", description = "Dados inválidos"),
    @ApiResponse(responseCode = "409", description = "Recurso já existe")
})
public ResponseEntity<RecursoDTO> criar(
    @Parameter(description = "Dados para criação do recurso")
    @Valid @RequestBody RecursoCreateDTO createDTO
) {
    Recurso novoRecurso = mapper.toEntity(createDTO);
    Recurso recursoSalvo = service.criar(novoRecurso);
    RecursoDTO dto = mapper.toDTO(recursoSalvo);
    
    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(recursoSalvo.getId())
        .toUri();
        
    return ResponseEntity.created(location).body(dto);
}
```

### **4. 🔄 Atualização de Recurso**

```java
@PutMapping("/{id}")
@Operation(summary = "Atualizar recurso existente")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Recurso atualizado"),
    @ApiResponse(responseCode = "404", description = "Recurso não encontrado"),
    @ApiResponse(responseCode = "400", description = "Dados inválidos")
})
public ResponseEntity<RecursoDTO> atualizar(
    @Parameter(description = "ID do recurso")
    @PathVariable @Positive Long id,
    
    @Parameter(description = "Dados para atualização")
    @Valid @RequestBody RecursoUpdateDTO updateDTO
) {
    Recurso recursoAtualizado = service.atualizar(id, updateDTO);
    RecursoDTO dto = mapper.toDTO(recursoAtualizado);
    return ResponseEntity.ok(dto);
}
```

### **5. 🗑️ Exclusão de Recurso**

```java
@DeleteMapping("/{id}")
@Operation(summary = "Excluir recurso")
@ApiResponses({
    @ApiResponse(responseCode = "204", description = "Recurso excluído"),
    @ApiResponse(responseCode = "404", description = "Recurso não encontrado"),
    @ApiResponse(responseCode = "409", description = "Não é possível excluir")
})
public ResponseEntity<Void> excluir(
    @Parameter(description = "ID do recurso")
    @PathVariable @Positive Long id
) {
    service.excluir(id);
    return ResponseEntity.noContent().build();
}
```

---

## 🎨 DTOs com Validações

### **📥 DTO de Criação**

```java
@Schema(description = "Dados para criação de recurso")
public class RecursoCreateDTO {
    
    @Schema(description = "Nome do recurso", example = "Recurso Exemplo")
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String nome;
    
    @Schema(description = "Descrição detalhada", example = "Descrição completa do recurso")
    @Size(max = 500, message = "Descrição não pode exceder 500 caracteres")
    private String descricao;
    
    @Schema(description = "Status ativo", example = "true")
    @NotNull(message = "Status é obrigatório")
    private Boolean ativo;
    
    @Schema(description = "Categoria do recurso", example = "CATEGORIA_A")
    @NotNull(message = "Categoria é obrigatória")
    @Enumerated(EnumType.STRING)
    private CategoriaEnum categoria;
    
    @Schema(description = "Valor monetário", example = "99.99")
    @DecimalMin(value = "0.0", message = "Valor deve ser positivo")
    @Digits(integer = 10, fraction = 2, message = "Formato de valor inválido")
    private BigDecimal valor;
    
    // getters e setters
}
```

### **📤 DTO de Resposta**

```java
@Schema(description = "Dados de resposta do recurso")
public class RecursoDTO {
    
    @Schema(description = "ID único do recurso", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    
    @Schema(description = "Nome do recurso")
    private String nome;
    
    @Schema(description = "Descrição do recurso")
    private String descricao;
    
    @Schema(description = "Indica se está ativo")
    private Boolean ativo;
    
    @Schema(description = "Categoria do recurso")
    private CategoriaEnum categoria;
    
    @Schema(description = "Valor formatado para exibição", example = "R$ 99,99")
    private String valorFormatado;
    
    @Schema(description = "Data de criação", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime criadoEm;
    
    @Schema(description = "Data da última atualização", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime atualizadoEm;
    
    // getters e setters
}
```

### **🔍 DTO de Filtros**

```java
@Schema(description = "Filtros para busca de recursos")
public class RecursoFiltroDTO {
    
    @Schema(description = "Buscar por nome (busca parcial)", example = "exemplo")
    private String nome;
    
    @Schema(description = "Filtrar por categoria")
    private CategoriaEnum categoria;
    
    @Schema(description = "Filtrar apenas ativos")
    private Boolean apenasAtivos;
    
    @Schema(description = "Valor mínimo")
    @DecimalMin(value = "0.0", message = "Valor mínimo deve ser positivo")
    private BigDecimal valorMinimo;
    
    @Schema(description = "Valor máximo")
    @DecimalMin(value = "0.0", message = "Valor máximo deve ser positivo")
    private BigDecimal valorMaximo;
    
    @Schema(description = "Data inicial para filtro")
    @Past(message = "Data inicial deve estar no passado")
    private LocalDate dataInicial;
    
    @Schema(description = "Data final para filtro")
    private LocalDate dataFinal;
    
    // getters e setters
}
```

---

## 📖 Documentação Swagger Avançada

### **🏷️ Tags e Operações**

```java
@Tag(
    name = "Recursos", 
    description = "API para gerenciamento de recursos do sistema"
)
@Operation(
    summary = "Operação resumida",
    description = """
        Descrição detalhada da operação em **Markdown**.
        
        ### Funcionalidades:
        - Item 1
        - Item 2
        
        ### Casos de Uso:
        - Caso A
        - Caso B
        """,
    tags = {"Recursos"}
)
```

### **📝 Exemplos Completos**

```java
@io.swagger.v3.oas.annotations.parameters.RequestBody(
    description = "Dados do recurso",
    required = true,
    content = @Content(
        mediaType = "application/json",
        schema = @Schema(implementation = RecursoCreateDTO.class),
        examples = {
            @ExampleObject(
                name = "Exemplo Básico",
                value = """
                    {
                        "nome": "Produto Exemplo",
                        "descricao": "Descrição do produto",
                        "ativo": true,
                        "categoria": "CATEGORIA_A",
                        "valor": 99.99
                    }
                    """
            ),
            @ExampleObject(
                name = "Exemplo Completo",
                value = """
                    {
                        "nome": "Produto Premium",
                        "descricao": "Produto com todas as funcionalidades",
                        "ativo": true,
                        "categoria": "CATEGORIA_PREMIUM",
                        "valor": 299.99
                    }
                    """
            )
        }
    )
)
```

### **🔧 Respostas Documentadas**

```java
@ApiResponses({
    @ApiResponse(
        responseCode = "200",
        description = "✅ Operação realizada com sucesso",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = RecursoDTO.class)
        )
    ),
    @ApiResponse(
        responseCode = "400",
        description = "❌ Dados inválidos fornecidos",
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = """
                    {
                        "error": "Bad Request",
                        "message": "Dados inválidos",
                        "details": {
                            "nome": "Nome é obrigatório",
                            "valor": "Valor deve ser positivo"
                        },
                        "timestamp": "2025-08-27T14:30:00Z"
                    }
                    """
            )
        )
    ),
    @ApiResponse(
        responseCode = "404",
        description = "🔍 Recurso não encontrado",
        content = @Content(
            mediaType = "application/json",
            examples = @ExampleObject(
                value = """
                    {
                        "error": "Not Found",
                        "message": "Recurso com ID 123 não foi encontrado",
                        "timestamp": "2025-08-27T14:30:00Z"
                    }
                    """
            )
        )
    )
})
```

---

## 🔒 Segurança e Validações

### **🛡️ Validações de Entrada**

```java
// Validações básicas
@NotNull(message = "Campo obrigatório")
@NotBlank(message = "Campo não pode estar vazio")
@NotEmpty(message = "Lista não pode estar vazia")

// Validações de tamanho
@Size(min = 2, max = 100, message = "Tamanho inválido")
@Length(min = 5, max = 50, message = "Comprimento inválido")

// Validações numéricas
@Min(value = 0, message = "Valor mínimo é 0")
@Max(value = 100, message = "Valor máximo é 100")
@Positive(message = "Deve ser positivo")
@PositiveOrZero(message = "Deve ser positivo ou zero")

// Validações de formato
@Email(message = "Email inválido")
@Pattern(regexp = "\\d{11}", message = "CPF deve ter 11 dígitos")
@URL(message = "URL inválida")

// Validações de data
@Past(message = "Data deve estar no passado")
@Future(message = "Data deve estar no futuro")
@PastOrPresent(message = "Data deve ser passado ou presente")
```

### **🔐 Autorização**

```java
@PreAuthorize("hasRole('ADMIN')")
@Operation(security = @SecurityRequirement(name = "bearerAuth"))
public ResponseEntity<RecursoDTO> operacaoRestrita() {
    // implementação
}
```

---

## 🛠️ Tratamento de Erros

### **⚠️ Exception Handler Global**

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        return Map.of(
            "error", "Validation Failed",
            "message", "Dados inválidos",
            "details", errors,
            "timestamp", Instant.now()
        );
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleNotFound(EntityNotFoundException ex) {
        return Map.of(
            "error", "Not Found",
            "message", ex.getMessage(),
            "timestamp", Instant.now()
        );
    }
}
```

---

## 🧪 Testabilidade

### **🔬 Controller Test**

```java
@WebMvcTest(RecursoController.class)
class RecursoControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private RecursoService service;
    
    @Test
    void deveListarRecursos() throws Exception {
        // given
        Page<Recurso> recursos = new PageImpl<>(List.of(/* recursos */));
        when(service.buscarComFiltros(any(), any())).thenReturn(recursos);
        
        // when & then
        mockMvc.perform(get("/api/recursos"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray());
    }
    
    @Test
    void deveCriarRecurso() throws Exception {
        // given
        String jsonRequest = """
            {
                "nome": "Teste",
                "descricao": "Descrição teste",
                "ativo": true,
                "categoria": "CATEGORIA_A",
                "valor": 99.99
            }
            """;
        
        // when & then
        mockMvc.perform(post("/api/recursos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isCreated());
    }
}
```

---

## 🎯 Boas Práticas Resumidas

### **✅ Fazer:**
- **Use DTOs** separados para entrada e saída
- **Valide todas as entradas** com Bean Validation
- **Documente completamente** com Swagger
- **Trate erros adequadamente** com handlers globais
- **Implemente paginação** para listagens
- **Use ResponseEntity** para controle preciso de status
- **Separe responsabilidades** (Controller → Service → Repository)

### **❌ Evitar:**
- **Expor entidades JPA** diretamente
- **Misturar lógica de negócio** no controller
- **Ignorar validações** de entrada
- **Documentação incompleta** ou ausente
- **Retornos inconsistentes** de status HTTP
- **Métodos muito grandes** ou complexos

---

## 📚 Recursos Adicionais

### **🔗 Links Úteis:**
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Bean Validation Specification](https://beanvalidation.org/2.0/spec/)
- [OpenAPI 3 Specification](https://swagger.io/specification/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/)

### **📖 Padrões Recomendados:**
- **REST API Design** - Princípios RESTful
- **Clean Code** - Código limpo e legível
- **SOLID Principles** - Princípios de design
- **Test-Driven Development** - Desenvolvimento orientado a testes

---

**🎯 Conclusão:** Este guia fornece uma base sólida para desenvolvimento de controllers REST profissionais, focando em código limpo, documentação completa e boas práticas de validação e segurança.
