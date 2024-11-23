## Tecnologias e ferramentas envolvidas

Para o desenvolvimento do Backend, foram utilizadas as seguintes tecnologias e ferramentas:

- Python
- Django

## Banco de Dados

O banco de dados escolhido foi:

- PostgreSQL

## Para conseguir acessar e rodar o projeto
Para rodar o projeto, siga os seguintes passos:

1 - Clone o repositório do GitHub para uma IDE de sua preferência.

2 - Configure o banco de dados: Baixe e instale o PostgreSQL. Em seguida, crie um banco de dados chamado "delivery_bd".

3 - Ajuste as configurações do banco de dados: No projeto, acesse o arquivo "settings.py" e localize a seção DATABASES. Atualize essa seção com as configurações do seu banco de dados local (usuário, senha, host, etc.).

4 - Sincronize o banco de dados:
- No terminal, execute os comandos:
- python manage.py makemigrations
- python manage.py migrate
  
Isso garantirá que o banco de dados esteja sincronizado com os modelos do Django.

5 - Inicie o servidor:
- Após a sincronização, execute o comando:
- python manage.py runserver
  
Isso iniciará o servidor local para o projeto.


Observação: Pode ser necessário instalar dependências adicionais. Para isso, use o comando pip install -r requirements.txt no diretório do Backend, que instalará todas as bibliotecas listadas no arquivo requirements.txt.
