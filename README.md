```mermaid
flowchart TD
    subgraph FASE1["Fase 1: Ingesta y Resguardo"]
        A[Origen / Cliente] -->|1. Envío de XML| L_Ingesta[Lambda Ingesta / API]
        L_Ingesta -->|2. Guarda XML| S3_Main[("S3 Bucket Principal\n(Región Actual)")]
    end

    subgraph FASE2["Fase 2: Consultas Batch y Fallback (Event-Driven)"]
        Client_Batch[Cliente / Trigger Batch] -->|3. Publica Petición Batch| EB[Amazon EventBridge]
        EB -->|4. Encola Consultas| SQS[Amazon SQS\n(Queue + DLQ)]
        
        SQS -->|5. Triggers Batch Execution| SF[AWS Step Functions\n(State Machine)]
        
        subgraph STEP_FUNCTIONS["Step Functions Workflow"]
            direction TB
            Start([Inicio Batch Task]) --> L_SearchMain[Lambda: Búsqueda Local]
            
            L_SearchMain -->|6. Consulta XML| S3_Main
            
            L_SearchMain --> Choice{¿Encontrado en S3 Principal?}
            
            Choice -->|Sí| Success[Retorna XML / Status 200]
            Choice -->|No 404| L_SearchHist[Lambda: Búsqueda Cross-Region]
            
            L_SearchHist -->|7. Consulta XML Histórico| S3_Hist
            
            L_SearchHist --> Choice2{¿Encontrado en Histórico?}
            Choice2 -->|Sí| SuccessHist[Retorna XML / Status 200]
            Choice2 -->|No 404| Fail[Manejo de Error / DLQ]
        end
    end

    subgraph REGION_HISTORICA["Región Secundaria (Histórico)"]
        S3_Hist[("S3 Bucket Histórico\n(En Migración por otro equipo)")]
    end

    subgraph CICD_IAC["CI/CD & Provisionamiento"]
        Jenkins[Jenkins Pipeline] -->|Terraform Apply| AWS_Infra[Recursos de AWS]
    end

    %% Estilos
    classDef mainBucket fill:#f9f,stroke:#333,stroke-width:2px;
    classDef histBucket fill:#bbf,stroke:#333,stroke-width:2px;
    class S3_Main mainBucket;
    class S3_Hist histBucket;
```
