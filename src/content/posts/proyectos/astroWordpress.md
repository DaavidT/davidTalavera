---
title: 'Astro JS como headless de Wordpress'
description: 'Utilizando Astro JS como front-end y recibe los assets y datos en un wordpress con GraphQL'
published: 2024-03-01
image: './project-2.jpg'
tags: ['Atro JS', 'WordPress', 'GraphQL']
category: 'Proyecto'
draft: false 
lang: 'es'
---

## Descripción

Astro es un nuevo framework de JavaScript que cuya popularidad esta aumentando cada vez más. En este proyecto se realizó una página web, la cuál necesita de muchas imágenes que pueden cambiar según el cliente. Para esto de decidió dividir el proyecto en dos:  

- Un administrador de archivos multimedia
- Un página que verán los usuarios finales donde se muestren estos archivos con el diseño del cliente.
Por la rapidez del proyecto y la infraestructura del cliente, se desarrolló este administrador de archivos multimedia en una plataforma que corre WordPress, esta plataforma funciona como una API la cual recibe una petición con el plugin de GraphQL y regresa el enlace de las imágenes al front para que este las pueda mostrar correctamente. 
Si bien se pudo desarrollar esta página solamente con la aplicación de WordPress, se tomó la decisión no realizarla por completo para poder comprobar las capacidades de personalización que nos puede dar el framework de Astro.

## Despliegue

Una vez terminado el desarrollo en local de la aplicación y por las características de SSR (Server-Side Rendering) se desplegó en la plataforma de Vercel ya que astro tiene su propio adaptador para esta plafatorma, se hicieron los cambios en las configuraciones y Vercel se encargó de realizar el build de forma correcta.

## Tecnologías utilizadas

[Astro JS](https://astro.build/)

[Wordpress](https://wordpress.com/es/)

[GraphQL](https://www.wpgraphql.com/)
