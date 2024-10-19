
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
      "/user/me": {
        "get": {
          "operationId": "UserController_me",
          "summary": "Отримання поточного користувача",
          "parameters": [],
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
      "/auth/register": {
        "post": {
          "operationId": "AuthController_register",
          "summary": "Реєстрація нового користувача",
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
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Логін користувача",
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
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/logout": {
        "get": {
          "operationId": "AuthController_logout",
          "summary": "Логаут користувача",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/refresh-tokens": {
        "get": {
          "operationId": "AuthController_refreshTokens",
          "summary": "Отримання рефреш токена",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/auth/google": {
        "get": {
          "operationId": "AuthController_googleAuth",
          "summary": "Google аутентифікація",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Auth"
          ]
        }
      },
      "/events": {
        "post": {
          "operationId": "EventsController_createEvent",
          "summary": "Create a new event",
          "parameters": [],
          "responses": {
            "201": {
              "description": "The event has been successfully created."
            },
            "400": {
              "description": "Invalid data for creating event."
            }
          },
          "tags": [
            "Events"
          ]
        },
        "get": {
          "operationId": "EventsController_findAllEvents",
          "summary": "Retrieve all events",
          "parameters": [],
          "responses": {
            "200": {
              "description": "List of events retrieved successfully."
            }
          },
          "tags": [
            "Events"
          ]
        }
      },
      "/events/{id}": {
        "get": {
          "operationId": "EventsController_findOneEvent",
          "summary": "Retrieve a specific event by ID",
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
            "200": {
              "description": "Event retrieved successfully."
            },
            "404": {
              "description": "Event not found."
            }
          },
          "tags": [
            "Events"
          ]
        },
        "patch": {
          "operationId": "EventsController_updateEvent",
          "summary": "Update an existing event",
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
            "200": {
              "description": "The event has been successfully updated."
            },
            "404": {
              "description": "Event not found."
            }
          },
          "tags": [
            "Events"
          ]
        },
        "delete": {
          "operationId": "EventsController_deleteEvent",
          "summary": "Delete an event by ID",
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
              "description": "The event has been successfully deleted."
            },
            "404": {
              "description": "Event not found."
            }
          },
          "tags": [
            "Events"
          ]
        }
      }
    },
    "info": {
      "title": "MindLab Platform example",
      "description": "The mindlab platform API description",
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
          "properties": {
            "email": {
              "type": "string",
              "example": "example@example.com",
              "description": "Email of the user"
            },
            "name": {
              "type": "string",
              "example": "John Doe",
              "description": "Name of the user"
            },
            "password": {
              "type": "string",
              "example": "password123",
              "description": "Password of the user"
            },
            "passwordRepeat": {
              "type": "string",
              "example": "password123",
              "description": "Repeat password of the user"
            }
          },
          "required": [
            "email",
            "name",
            "password",
            "passwordRepeat"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "example@example.com",
              "description": "Email of the user"
            },
            "name": {
              "type": "string",
              "example": "John Doe",
              "description": "Name of the user"
            },
            "password": {
              "type": "string",
              "example": "password123",
              "description": "Password of the user"
            }
          },
          "required": [
            "email",
            "name",
            "password"
          ]
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
