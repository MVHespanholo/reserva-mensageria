# Projeto de Mensageria para Sistema de Reservas

Este projeto é um **consumidor de mensagens** baseado em **Google Pub/Sub** para processar dados de reservas de um sistema de hotelaria e armazená-los em um banco de dados relacional. Ele foi desenvolvido como parte da atividade de **Computação em Nuvem II** sobre mensageria.

---

## 🚀 **Funcionalidades**
- **Consumo de mensagens** do Google Pub/Sub.
- **Persistência de dados** de reservas em um banco de dados PostgreSQL.
- **Tratamento de conflitos** com `ON CONFLICT` para evitar duplicidades.
- **API REST** para consulta de reservas com filtros específicos.
- **Cálculo automático** do valor total das reservas.

---

## 🏭️ **Estrutura do Banco de Dados**
As tabelas mínimas implementadas são:
1. **customers** – Armazena dados de clientes.
2. **reservations** – Armazena os detalhes das reservas.
3. **rooms** – Armazena informações sobre os quartos reservados.
4. **categories** – Armazena as categorias dos quartos.
5. **subcategories** – Armazena subcategorias de quartos.
6. **reservation_rooms** – Relaciona quartos reservados a cada reserva.

---

## 🔍 **Como Usar**

### 📦 **Instalação**

#### 1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/reserva-mensageria.git
cd reserva-mensageria
```

#### 2. **Instale as dependências**
```bash
npm install
```

#### 3. **Configure o banco de dados**
- Crie um banco PostgreSQL com as tabelas necessárias (veja a estrutura acima).

#### 4. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:

```plaintext
DB_USER=seu_usuario
DB_HOST=localhost
DB_NAME=nome_do_banco
DB_PASSWORD=sua_senha
DB_PORT=5432

SUBSCRIPTION_NAME=nome_da_subscription
```

#### 5. **Credenciais do Google Pub/Sub**
- Baixe o arquivo de credenciais do Google Cloud (`.json`).
- Coloque-o na raiz do projeto como `credenciais.json`.

---

### 🏃‍♂️ **Execução**

#### **Inicie o consumidor**
```bash
node index.js
```

#### **API de Consulta**
Endpoint: `GET /reserves`

**Filtros:**
- `uuid` – ID da reserva
- `customer_id` – ID do cliente
- `room_id` – ID do quarto

**Exemplo de Resposta:**
```json
{
  "uuid": "3030-499f-39f949",
  "created_at": "2023-09-01 22:33:00",
  "type": "AB",
  "customer": {
    "id": 99494,
    "name": "João da Silva"
  },
  "rooms": [
    {
      "id": 1,
      "daily_rate": 300.00,
      "number_of_days": 3,
      "reservation_date": "2025-09-15",
      "category": {
        "id": "AM",
        "sub_category": {
          "id": "BCRU"
        }
      }
    }
  ],
  "total_value": 900.00
}
```

---

## 🧪 **Testes**
1. Envie uma mensagem para o tópico do Pub/Sub.
2. Verifique o armazenamento no banco de dados.
3. Consulte os dados via API.

---

## 🛠️ **Tecnologias Utilizadas**
- **Node.js** – Ambiente de execução.
- **Google Pub/Sub** – Mensageria.
- **PostgreSQL** – Banco de dados.
- **dotenv** – Gerenciamento de variáveis de ambiente.

---

## 📄 **Licença**
MIT License. Consulte o arquivo `LICENSE` para detalhes.

---

**Desenvolvido por:** Marlon Vinicius e Marcos Vinicius
