$kind: http-request
name: Create Product
method: POST
url: 'http://localhost:3000/api/products'
description: Create a new product
order: 2000
headers:
  - key: Content-Type
    value: application/json
body:
  type: json
  content: |-
    {
      "nombre": "Test Product",
      "descripcion": "A product created by Postman tests",
      "precio": 99.99,
      "stock": 50,
      "imagen_url": "https://example.com/product.jpg"
    }
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is 201", function () {
        pm.response.to.have.status(201);
      });
      pm.test("Response has created product", function () {
        const json = pm.response.json();
        pm.expect(json).to.have.property("id");
        pm.expect(json.nombre).to.eql("Test Product");
        pm.expect(json.precio).to.eql(99.99);
        pm.expect(json.stock).to.eql(50);
      });
      pm.test("Response time is less than 2000ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(2000);
      });
      pm.collectionVariables.set("newProductId", pm.response.json().id);
