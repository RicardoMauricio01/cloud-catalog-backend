$kind: http-request
name: Get All Products
method: GET
url: 'http://localhost:3000/api/products'
description: Retrieve all active products
order: 1000
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is 200", function () {
        pm.response.to.have.status(200);
      });
      pm.test("Response is an array", function () {
        const json = pm.response.json();
        pm.expect(json).to.be.an("array");
      });
      pm.test("Response time is less than 2000ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(2000);
      });
      if (pm.response.json().length > 0) {
        pm.test("Each product has required fields", function () {
          const products = pm.response.json();
          products.forEach(function(p) {
            pm.expect(p).to.have.property("id");
            pm.expect(p).to.have.property("nombre");
            pm.expect(p).to.have.property("precio");
            pm.expect(p).to.have.property("stock");
          });
        });
        pm.collectionVariables.set("productId", pm.response.json()[0].id);
      }
