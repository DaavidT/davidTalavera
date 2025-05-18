---
title: Dockerizando codeigniter 3
published: 2024-03-01
description: 'Codeigniter 3 es un framework de php con el model MVP, solo necesita de un servidor apache para correr, por lo que generé un docker file que se conecta a una base de datos y permite ejecutar aplicaciones con este framework.'
image: './project-1.jpg'
tags: ['PHP', 'Docker', 'Codeigniter', 'MySQL']
category: 'Proyecto'
draft: false 
lang: 'es'
---
![Vista del proyecto](/project-1.jpg)

Ve directo al [repositorio](https://github.com/DaavidT/DockerCodeIgniter3).

## Poblemática

- Dar mantenimiento a una aplicación en producción con php 7.4
- Replicar el entorno de producción
- Agregar un sistema de versiones
- Poder implementar el entorno de pruebas local con los mismos paquetes

## Descripción

Se utilizó docker-compose para poder levantar ambos servicios. Como se necesita que la versión de php sea 7.4 con un servidor de apache y varios plugins para la conexión al base de datos MySQL, se creó un carpeta `/php` donde se agregan las configuraciones extra.

## Código

```yml
version: "3"
services:
  php:
    build:
      context: ./php
      dockerfile: DockerFile
    container_name: codeigniter3
    depends_on:
      - mysql
    volumes:
      - ./codeigniter3:/var/www/html
    ports:
      - 7700:80
    stdin_open: true
    tty: true

  mysql:
    container_name: mysql
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: 
      MYSQL_DATABASE: 
      MYSQL_USER: 
      MYSQL_PASSWORD: 
    volumes:
      - ./mysql-data:/var/lib/mysql
      - ./database.sql:/docker-entrypoint-initdb.d/database.sql
    ports:
      - 3310:3306

  phpmyadmin:
    container_name: phpmyadmin-ci
    image: phpmyadmin/phpmyadmin
    ports:
      - "8080:80"
    restart: always
    environment:
      PMA_HOST: mysql
    depends_on:
      - mysql
```

```docker
FROM php:7.4-apache
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN apt-get update && apt-get upgrade -y
RUN a2enmod rewrite
```

## Tecnologías utlizadas

[Docker](https://es.wikipedia.org/wiki/Docker_(software))

[Codeigniter](https://es.wikipedia.org/wiki/CodeIgniter)

[Github](https://github.com)