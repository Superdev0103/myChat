# MyChat

## Instrucciones para publicar a producción

**1- Crear archivo `.env`**
- Poner las siguientes variables:

> ```ENV
> ID_WH="" # El ID de la webhook que usará la app para enviar mensajes. (desde la web a Discord)
> TOKEN_WH="" # El TOKEN de la webhook que usará la app para enviar mensajes. (desde la web a Discord)
> CLIENT_ID="" # El ID del cliente de la applicación de discord.dev
> CLIENT_SECRET="" # El código secreto del cliente de la applicación de discord.dev
> URL="http://localhost:3030" # El URL de la applicación, ya sea desplegada o en desarrollo, en este caso en desarrollo es el que esta.
> ID_CHANNEL_LOG="" # El ID del canal de Discord en donde se envian logs de la web.
> ID_CHANNEL="" # El ID del canal de Discord en donde se envian y reciben mensajes. # Adicional: La webhook los envia a el canal donde se estableció.
> TOKEN_BOT="" # https://cdn.discordapp.com/emojis/502676415708266497.png?v=1
> ```

**2- Ejecutar tu aplicación**
- Ejecutar el siguiente comando:
> En desarrollo:
> ```bash
> npm run dev
> ```

> En producción:
> ```bash
> npm start
> ```
> NOTA: En producción tal vez quieras ejecutar tu app con nodejs (`node index.js`) desde algun servicio que la mantenga activa, por ejemplo [systemd](https://en.wikipedia.org/wiki/Systemd) (Wikipedia)

## ADICIONAL:
En el archivo `.env.example` que se encuentra en la carpeta principal esta un ejemplo de CraterMaik de como deberia ser el `.env` (Pero mejor leen arriba).
