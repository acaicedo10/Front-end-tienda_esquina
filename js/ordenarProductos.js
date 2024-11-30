window.paypal
  .Buttons({
    style: {
      shape: "rect",
      layout: "vertical",
      color: "gold",
      label: "paypal",
    },
    message: {
      amount: 100,
    },

    async createOrder() {
      try {
        const pedidoUsuarioString = localStorage.getItem("pedidoUsuario");
        const pedidoUsuarioJson = JSON.parse(pedidoUsuarioString);
        const token = localStorage.getItem("token");

        const response = await fetch(tunel + "/api/orders", {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          // use the "body" param to optionally pass additional order information
          // like product ids and quantities
          body: JSON.stringify({
            items: pedidoUsuarioJson,
            paymentMethod: "paypal",
          }),
        });

        const orderData = await response.json();

        if (orderData.data.paypalOrderId) {
          localStorage.setItem("idOrden", orderData.data.order._id);
          return orderData.data.paypalOrderId;
        }
        if (orderData.errors == true) {
          showToast(orderData.message, "error");
          return;
        }
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);

        throw new Error(errorMessage);
      } catch (error) {
        console.log(error);
      }
    },

    async onApprove(data, actions) {
      try {
        const idOrden = localStorage.getItem("idOrden");
        const token = localStorage.getItem("token");

        const response = await fetch(tunel + `/api/orders/capture-payment`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderID: idOrden,
            paypalOrderId: data.orderID,
          }),
        });

        const orderData = await response.json();
        // Three cases to handle:
        //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
        //   (2) Other non-recoverable errors -> Show a failure message
        //   (3) Successful transaction -> Show confirmation or thank you message
        if (orderData.errors == true) {
          showToast(orderData.message, "error");
          return;
        }
        const errorDetail = orderData.data.purchase_units?.details?.[0];

        if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
          // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          // recoverable state, per
          // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
          return actions.restart();
        } else if (errorDetail) {
          // (2) Other non-recoverable errors -> Show a failure message
          throw new Error(
            `${errorDetail.description} (${orderData.data.purchase_units.debug_id})`
          );
        } else if (!orderData.data.purchase_units.result.purchase_units) {
          throw new Error(JSON.stringify(orderData));
        } else {
          console.log("gola");
          // (3) Successful transaction -> Show confirmation or thank you message
          // Or go to another URL:  actions.redirect('thank_you.html');
          const transaction =
            orderData.data.purchase_units.result?.purchase_units?.[0]?.payments
              ?.captures?.[0] ||
            orderData.data.purchase_units.result?.purchase_units?.[0]?.payments
              ?.authorizations?.[0];

          showToast(
            `${orderData.message} con estado ${transaction.status}`,
            "success",
            5000
          );
          setTimeout(function () {
            window.location.href = "index.html";
          }, 1000);
        }
      } catch (error) {
        console.log(error.message);
        showToast(error.message, "error");
      }
    },
  })
  .render("#paypal-button-container");
