import React, { useState } from 'react';

function DashboardPage() {
  return(
    <html data-theme="dark">
      <head>
        <meta charset="UTF-8" />
        <title>Task List</title>
        <link rel="stylesheet" href="index.css" />
        <link rel="stylesheet" href="../node_modules/@picocss/pico/css/pico.min.css"/>
        <script src="https://kit.fontawesome.com/523f3a835f.js" crossorigin="anonymous"></script>
        <script defer src="render.js"></script>
      </head>
      <div class="dragable"></div>
      <body>
        <main class="container">
          <div class="headings">
            <h1>Task List</h1>
            <progress id="pgb" value="0" max="0"></progress>
          </div>
          <div id="tasks">
            <ul class="list" id="list"></ul>
            <button id="addItem" style="outline: 0;" class="secondary outline ghost">
              <i class="fa-regular fa-plus"></i>
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}