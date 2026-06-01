$kind: http-request
name: Delete Product
method: DELETE
url: 'http://localhost:3000/api/products/{{newProductId}}'
description: 'Soft-delete a product by ID (sets activo = false)'
order: 5000
scripts:
  - type: afterResponse
    language: text/javascript
    code: |-
      pm.test("Status code is 200", function () {
        pm.response.to.have.status(200);
      });
      pm.test("Response confirms deletion", function () {
        const json = pm.response.json();
        pm.expect(json).to.have.property("ok");
        pm.expect(json.ok).to.be.true;
      });
      pm.test("Response time is less than 2000ms", function () {
        pm.expect(pm.response.responseTime).to.be.below(2000);
      });
