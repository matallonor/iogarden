# Unison API Backend v2

# References
* https://codewithhugo.com/using-es6-classes-for-sequelize-4-models/

# Run
* Node 
    - npm start
* DB
    - docker-compose up -d

# Database
* Create table and add fixtures
    - npm run sequelize:migrate
    - npm run sequelize:seed:all

* Undo migrations and fixtures
    - npm run sequelize:migrate:undo
    - npm run sequelize:migrate:undo:all
    - npm run sequelize:seed:undo
    - npm run sequelize:seed:undo:all

# Postman
https://www.getpostman.com/collections/d09ad223e34af65b124e
