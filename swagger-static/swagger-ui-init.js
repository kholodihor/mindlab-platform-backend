
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/user/{idOrEmail}": {
        "get": {
          "operationId": "UserController_findOneUser",
          "summary": "Отримання користувача по ID чи по email",
          "parameters": [
            {
              "name": "idOrEmail",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/user/{id}": {
        "delete": {
          "operationId": "UserController_deleteUser",
          "summary": "Видалення користувача",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "tags": [
            "Users"
          ]
        }
      },
      "/auth/register": {
        "post": {
          "operationId": "AuthController_register",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        }
      },
      "/auth/refresh-tokens": {
        "get": {
          "operationId": "AuthController_refreshTokens",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      }
    },
    "info": {
      "title": "MindLab Platform example",
      "description": "The cows shelter API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "mindlab",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
        "RegisterDto": {
          "type": "object",
          "properties": {}
        },
        "LoginDto": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
