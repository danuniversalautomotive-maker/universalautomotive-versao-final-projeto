// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
!function (window, jQuery) {
	jQuery(function ($) {
		var disablePersonalInfoEditButton = {
			init: function init() {
				util.waitElement($("#edit-profile-data"), function () {
					$(
						".accordion-toggle.collapsed .link-box-edit.btn.btn-small"
					).remove();
					$("#is-not-me").remove();
				});
			},
		};

		var poNumberFeature = {
			showInputOnPOSection: false,
			init: function init() {
				poNumberInput.init();
				fakeSubmitButton.init();
				util.onPageStopLoading(function () {
					if (poNumberFeature.showInputOnPOSection) {
						$(
							".box-payment-group2.box-payment-option.custom201PaymentGroupPaymentGroup"
						).append(poNumberInput.input);
					} else {
						$(".payment-submit-wrap").append(poNumberInput.input);
					}

					originalSubmitButton.hide();
					$(".payment-submit-wrap").append(fakeSubmitButton.btn);
				});
				util.waitElement($("#payment-data-submit"), function () {});
			},
		};

		var fakeSubmitButton = {
			btn: null,
			init: function init() {
				fakeSubmitButton.btn = fakeSubmitButton.buildButton();
				fakeSubmitButton.btn.on("click", function () {
					theCheckout.handleSubmit();
				});
			},
			buildButton: function buildButton() {
				return $(
					'<button class="jsSubmitFakeButton btn btn-success btn-large btn-block">\n        <i class="icon-lock"></i>\n        <i class="icon-spinner icon-spin" style="display: none;"></i>\n        <span>Finalizar compra</span>\n      </button>'
				);
			},
			hideLoadingAndResetButton: function hideLoadingAndResetButton() {
				fakeSubmitButton.btn.find("i.icon-spinner").hide();
				fakeSubmitButton.btn.find("i.icon-lock").show();
				fakeSubmitButton.enableButton();
			},
			setButtonAsLoading: function setButtonAsLoading() {
				fakeSubmitButton.btn.find("i.icon-lock").hide();
				fakeSubmitButton.btn.find("i.icon-spinner").show();
				fakeSubmitButton.disableButton();
			},
			disableButton: function disableButton() {
				fakeSubmitButton.btn.attr("disabled", "");
			},
			enableButton: function enableButton() {
				fakeSubmitButton.btn.removeAttr("disabled");
			},
		};

		var originalSubmitButton = {
			hide: function hide() {
				$("[id=payment-data-submit]").css("visibility", "hidden");
				$("[id=payment-data-submit]").css("max-height", "0");
				$("[id=payment-data-submit]").css("height", "0");
				$("[id=payment-data-submit]").addClass("jsSubmitButton");
			},
		};

		var poNumberInput = {
			input: null,
			init: function init() {
				poNumberInput.input = poNumberInput.buildInput();
			},
			buildInput: function buildInput() {
				return $(
					'\n        <div style="\n      display: none;\n    padding-right: 15px;\n          margin-bottom: 10px;\n        " id="poWrap">\n        <label> Purchase Order Number: (optional) </label>\n          <input \n            type="text"\n            id="poNumberInput" style="\n            font-size: 20px;\n            height: 36px;\n            line-height: 34px;\n            width: 100%;" \n            name="poNumber">\n          <span class="help error feedback" style="display: none">This field is required.</span>\n        </div>'
				);
			},
			showError: function showError() {
				$("#poNumberInput").addClass("error");
				$("#poWrap").find(".feedback").show();
			},
			hideError: function hideError() {
				$("#poNumberInput").removeClass("error");
				$("#poWrap").find(".feedback").hide();
			},
			handleEmpty: function handleEmpty() {
				poNumberInput.showError();
				$("#poNumberInput").on("keypress", poNumberInput.hideError);
			},
		};

		var util = {
			waitElement: function waitElement(selector, fn) {
				var element = setInterval(function () {
					if ($(selector).length) {
						clearInterval(element);
						fn();
					}
				}, 200);
			},
			onOrignalButtonStopLoading: function onOrignalButtonStopLoading(
				fn
			) {
				var internal = setInterval(function () {
					if (!!!$(".jsSubmitButton").prop("disabled")) {
						clearInterval(internal);
						fn();
					}
				}, 200);
			},
			onPageStopLoading: function onPageStopLoading(fn) {
				var internal = setInterval(function () {
					if (!$("body.loading").length) {
						clearInterval(internal);
						fn();
					}
				}, 200);
			},
			onEmailIsSet: function onEmailIsSet(fn) {
				var internal = setInterval(function () {
					if (!!$(".client-profile-email span.email").text()) {
						clearInterval(internal);
						fn();
					}
				}, 200);
			},
		};

		var theCheckout = {
			submit: function submit() {
				$("#payment-data-submit").click();
			},
			handleSubmit: function handleSubmit() {
				var poNumber = {
					value: $("#poNumberInput")[0].value,
				};
				fakeSubmitButton.setButtonAsLoading();
				util.onOrignalButtonStopLoading(function () {
					fakeSubmitButton.enableButton();
					fakeSubmitButton.hideLoadingAndResetButton();
				});
				vtexjs.checkout.getOrderForm().then(function (data) {
					if (!!poNumber.value) {
						$.ajax({
							type: "PUT",
							url: "/api/checkout/pub/orderForm/".concat(
								data.orderFormId,
								"/customData/profile/poNumber"
							),
							data: poNumber,
							dataType: "json",
						}).then(theCheckout.submit);
					} else {
						theCheckout.submit();
					}
				});
			},
		};

		$(window).on("checkoutRequestBegin.vtex", function (event, orderForm) {
			if (document.querySelector("#clear-cart")) {
				document.querySelector("#clear-cart").innerText = "Clear Cart";
			}
			fakeSubmitButton.setButtonAsLoading();
			setTimeout(function () {
				fakeSubmitButton.hideLoadingAndResetButton();
			}, 1000);
		});

		poNumberFeature.init();
		disablePersonalInfoEditButton.init();
	});
};

//   window.addEventListener("DOMContentLoaded", () => {
//     $(window).on(
//         'orderFormUpdated.vtex ' +
//         'renderLoaderReady.vtex ' +
//         'paymentUpdated.vtex ' +
//         'stateUpdated.vtex ' +
//         'deliverySelected.vtex ' +
//         'shippingInformationUpdated.vtex ' +
//         'shippingRatePreviewLoading.vtex ' +
//         'transactionValidation.vtex ' +
//         'omniShippingChanged.vtex ' +
//         'componentValidated.vtex ' +
//         'componentDone.vtex ' +
//         'checkoutRequestBegin.vtex ' +
//         'hashchange', () => {

//         const cartToOrderFormElement = document.getElementById('cart-to-orderform')
//         const htmlCartToOrderForm = `
//             PROCEED
//             <svg width="14" height="12" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path d="M12.9142 4.58594L8.62115 0.292942L7.20715 1.70694L10.5002 4.99994H0.500153V6.99994H10.5002L7.20715 10.2929L8.62115 11.7069L12.9142 7.41394C13.2891 7.03889 13.4997 6.53027 13.4997 5.99994C13.4997 5.46961 13.2891 4.961 12.9142 4.58594Z" fill="white"/>
//            </svg>
//         `
//         $(cartToOrderFormElement).html(htmlCartToOrderForm);
//         var observer = new MutationObserver(() => {
//           observer.disconnect();
//           $(cartToOrderFormElement).html(htmlCartToOrderForm);
//         });

//         observer.observe(cartToOrderFormElement, {
//           childList: true,
//           attributes: true,
//           characterData: true,
//           subtree: true,
//           attributeOldValue: true,
//           characterDataOldValue: true
//         });
//     });
//   });

$(function () {
	MZPaymentOptions.initPaymentOptions();
});

function splitChars(string, charsToSplit) {
	const chars = string.split(",");

	var split = {};
	charsToSplit.forEach((char) => (split[char] = []));

	var leftChars = [];

	chars.forEach((char) => {
		if (charsToSplit.includes(char)) {
			split[char].push(char);
		} else {
			leftChars.push(char);
		}
	});

	for (var char in split) {
		split[char] = split[char].join(",");
	}
	var leftString = leftChars.join(",");

	var result = [];
	charsToSplit.forEach((char) => {
		if (split[char]) {
			result.push(split[char]);
		}
	});
	if (leftString) {
		result.push(leftString);
	}

	if (result.length > 1) {
		result.push(string);
	}

	return result;
}

const MZPaymentOptions = {
	selectedPromissory: "",
	selectedCustomerCredit: "",
	userPaymentOptions: {},
	userEmail: "",
	btnClass: ".jsSubmitFakeButton",
	isButtonDisabled: false,
	interval: null,
	toggleButtonState: (disabled) => {
		//using 1050ms to avoid conflict with the custom code that manipulates the button state
		$(MZPaymentOptions?.btnClass).attr("disabled", disabled);
		setTimeout(() => {
			$(MZPaymentOptions?.btnClass).attr("disabled", disabled);
		}, 1050);
	},
	handleCheckoutRequestBegin: () => {
		$(window).on("checkoutRequestBegin.vtex", function (evt, of) {
			if (MZPaymentOptions.isButtonDisabled) {
				MZPaymentOptions.toggleButtonState(true);
			} else {
				MZPaymentOptions.toggleButtonState(false);
			}
		});
	},
	initPaymentOptions: () => {
		if (vtexjs?.checkout?.orderForm) {
			MZPaymentOptions.getUserPaymentOptions(orderForm);
		}
		MZPaymentOptions.handleCheckoutRequestBegin();
		$(window).on("orderFormUpdated.vtex", function (event, orderForm) {
			if (
				MZPaymentOptions.userEmail !=
					orderForm?.clientProfileData?.email &&
				orderForm?.clientProfileData?.email
			) {
				MZPaymentOptions.getUserPaymentOptions(orderForm);
			}
			MZPaymentOptions.userEmail = orderForm?.clientProfileData?.email;
		});

		paymentData.showPaymentOptions.subscribe((value) => {
			if (value === true) {
				MZPaymentOptions.generateUserPaymentOptions();
			}
		});

		MZPaymentOptions.subscribeToPaymentOptionChange();
	},
	getUserPaymentOptions: (orderForm) => {
		const email = orderForm?.clientProfileData?.email;
		if (email) {
			//get user cluster from masterdata
			$.ajax({
				url: `/_v/checkout_middleware/getUserGroup?email=${encodeURIComponent(
					email
				)}`,
			}).then((data) => {
				if (data.length) {
					const authorizationGroup = data[0].authorizationGroup;
					const filteredWithoutForbiddenLetters = authorizationGroup.replace(/[ABCHKSX],?/g, '').replace(/,$/, '');
					const authorizationGroupArray = splitChars(
						filteredWithoutForbiddenLetters,
						["G", "H"]
					);
					if (authorizationGroupArray.length > 0) {
						const getCCOPromises = authorizationGroupArray.map(
							(authorizationGroup) => {
								return $.ajax({
									url: `/_v/checkout_middleware/getCCOptions?authorizationGroup=${encodeURIComponent(
										authorizationGroup
									)}`,
								});
							}
						);

						const getCPOptionsPromises =
							authorizationGroupArray.map(
								(authorizationGroup) => {
									return $.ajax({
										url: `/_v/checkout_middleware/getCPOptions?authorizationGroup=${encodeURIComponent(
											authorizationGroup
										)}`,
									});
								}
							);

						Promise.all(getCCOPromises)
							.then((responses) => {
								var uniqueDescriptions = new Set();
								var uniqueData = [];
								responses.forEach((data) => {
									data.forEach((obj) => {
										if (
											!uniqueDescriptions.has(
												obj.tipoNegociacao
											)
										) {
											uniqueDescriptions.add(
												obj.tipoNegociacao
											);
											uniqueData.push(obj);
										}
									});
								});

								MZPaymentOptions.userPaymentOptions[
									"customerCredit"
								] = uniqueData;
								MZPaymentOptions.generateUserPaymentOptions();
							})
							.catch((error) => {
								console.error(
									"Erro ao processar os grupos de autorização:",
									error
								);
							});

						Promise.all(getCPOptionsPromises)
							.then((responses) => {
								var uniqueDescriptions = new Set();
								var uniqueData = [];
								responses.forEach((data) => {
									data.forEach((obj) => {
										if (
											!uniqueDescriptions.has(
												obj.tipoNegociacao
											)
										) {
											uniqueDescriptions.add(
												obj.tipoNegociacao
											);
											uniqueData.push(obj);
										}
									});
								});

								MZPaymentOptions.userPaymentOptions[
									"customerPromissory"
								] = uniqueData;

								MZPaymentOptions.generateUserPaymentOptions();
							})
							.catch((error) => {
								console.error(
									"Erro ao processar os grupos de autorização:",
									error
								);
							});
					}
				}
			});
		}
	},
	subscribeToPaymentOptionChange: () => {
		paymentData.selectedPaymentGroups.subscribe((selectedPaymentGroups) => {
			selectedPaymentGroups.forEach((selectedPaymentGroup) => {
				if (
					selectedPaymentGroup.name == "Customer Credit" ||
					selectedPaymentGroup.name == "Promissory"
				) {
					if (selectedPaymentGroup.name == "Customer Credit") {
						MZPaymentOptions.generateCustomerCreditOptions(
							MZPaymentOptions.userPaymentOptions[
								"customerCredit"
							]
						);
					} else {
						//making sure that the button is enabled
						MZPaymentOptions.isButtonDisabled = false;
						MZPaymentOptions.toggleButtonState(false);
					}
					if (selectedPaymentGroup.name == "Promissory") {
						MZPaymentOptions.generateCustomerPromissoryOptions(
							MZPaymentOptions.userPaymentOptions[
								"customerPromissory"
							]
						);
					}
				} else {
					//sending empty customData
					MZPaymentOptions.isButtonDisabled = false;
					MZPaymentOptions.toggleButtonState(false);
					MZPaymentOptions.updateCustomData(null);
				}
			});
		});
	},
	generateCustomerPromissoryOptions: (userPaymentOptions) => {
		//empty selected customer credit
		MZPaymentOptions.isButtonDisabled = false;
		MZPaymentOptions.selectedCustomerCredit = "";
		if (!userPaymentOptions) return;

		//REMOVER FRETE
		const ofValue = vtexjs.checkout.orderForm.value;

		if (ofValue == 0) return;

		const conditionsToShow = userPaymentOptions
			.filter((cc) => {
				return cc.ativo && ofValue / 100 >= (cc.minOrderValue || 0);
			})
			?.sort((a, b) => a.taxa - b.taxa);
		//Mostrar mensagem
		if (conditionsToShow.length == 0) {
			$(".mz-payment-option-promissory").remove();
			MZPaymentOptions.updateCustomData(null);
			return;
		}

		if (!MZPaymentOptions.selectedPromissory) {
			const condition = conditionsToShow[0];
			MZPaymentOptions.selectedPromissory = condition.descricao;
			MZPaymentOptions.updateCustomData(condition).then(() => {
				vtexjs.checkout.getOrderForm();
			});
		}

		if (MZPaymentOptions.selectedPromissory) {
			const isAvailable = conditionsToShow.find(
				(op) => op.descricao == MZPaymentOptions.selectedPromissory
			);

			if (!isAvailable) {
				//check customData

				MZPaymentOptions.selectedPromissory =
					conditionsToShow[0].descricao;
				MZPaymentOptions.updateCustomData(conditionsToShow[0]).then(
					() => {
						vtexjs.checkout.getOrderForm();
					}
				);
			}
		}
		if (!MZPaymentOptions.selectedPromissory) {
			MZPaymentOptions.selectedPromissory = conditionsToShow[0].descricao;
		}

		const select = $(
			`<select>${conditionsToShow.map((cond) => {
				return `<option ${
					MZPaymentOptions.selectedPromissory === cond.descricao
				} value="${cond.descricao}">${MZPaymentOptions.getConditionText(
					cond,
					ofValue
				)}</option>`;
			})}</select>`
		).on("change", function (e) {
			//find cond on conditions to show
			MZPaymentOptions.selectedPromissory = e.target.value;
			const condition = conditionsToShow.find(
				(cond) => cond.descricao == e.target.value
			);
			MZPaymentOptions.updateCustomData(condition).then(() => {
				vtexjs.checkout.getOrderForm();
			});
		});

		const html = $(
			`<div class="mz-payment-option-promissory"><p class="mz-payment-option-cp-text>Selecione a forma de pagar</p></div>`
		);
		html.append(select);

		MZPaymentOptions.appendHtml(
			".mz-payment-option-promissory",
			"#payment-group-promissoryPaymentGroup",
			html
		);
	},
	getConditionText: (condition, ofValue) => {
		let tax = condition?.taxa || null;
		let ofValueFinal = ofValue;
		if (tax) {
			ofValueFinal = ofValue + (ofValue * Number(tax)) / 100;
		}
		let minOrderValue = condition?.minOrderValue || 0;
		let minInstallmentValue = condition?.minInstallmentValue || 0;

		let installments = Math.floor(minOrderValue / minInstallmentValue);
		let installmentValue = ofValueFinal / 100 / installments;
		let intlObj = Intl.NumberFormat("pt-br", {
			style: "currency",
			currency: "BRL",
		});
		return `${condition?.descricao}${
			installments && installments !== Infinity
				? ` - ${installments}x de ${intlObj.format(installmentValue)}`
				: ""
		}${` - ` + intlObj.format(ofValueFinal / 100)}${
			tax ? ` - Juros de ${tax}%` : ""
		}`;
	},
	generateCustomerCreditOptions(userPaymentOptions) {
		//empty selected promissory
		MZPaymentOptions.isButtonDisabled = false;
		MZPaymentOptions.selectedPromissory = "";
		if (!userPaymentOptions || userPaymentOptions.length == 0) return;

		const ofValue = vtexjs.checkout.orderForm.value;
		if (ofValue == 0) return;

		const conditionsToShow = userPaymentOptions
			.filter((cc) => {
				return cc.ativo && ofValue / 100 >= (cc.minOrderValue || 0);
			})
			?.sort((a, b) => a.taxa - b.taxa);

		//Mostrar mensagem
		if (conditionsToShow.length == 0) {
			const minInstallmentValue = userPaymentOptions.reduce(
				(min, item) => {
					return item.minOrderValue < min ? item.minOrderValue : min;
				},
				Infinity
			);

			$(MZPaymentOptions?.btnClass).attr("disabled", true);
			MZPaymentOptions.selectedCustomerCredit = "";
			MZPaymentOptions.isButtonDisabled = true;
			let noConditionsHtml = `<div class="mz-payment-option-cc"><p class="mz-payment-option-cc-text">Para habiliar essa condição de pagamento, o valor do pedido (sem frete) deve atingir o mínimo de ${minInstallmentValue.toLocaleString(
				"pt-BR",
				{ style: "currency", currency: "BRL" }
			)}.</p></div>`;
			$(".mz-payment-option-cc").remove();

			MZPaymentOptions.appendHtml(
				".mz-payment-option-cc",
				"#payment-group-creditControlPaymentGroup",
				noConditionsHtml
			);
			//empty custom data
			MZPaymentOptions.updateCustomData(null);
			return;
		}

		if (!MZPaymentOptions.selectedCustomerCredit) {
			MZPaymentOptions.selectedCustomerCredit =
				conditionsToShow[0].descricao;
			const condition = conditionsToShow[0];
			MZPaymentOptions.updateCustomData(condition).then(() => {
				vtexjs.checkout.getOrderForm();
			});
		}

		if (MZPaymentOptions.selectedCustomerCredit) {
			const isAvailable = conditionsToShow.find(
				(op) => op.descricao == MZPaymentOptions.selectedCustomerCredit
			);

			if (!isAvailable) {
				//check customData

				MZPaymentOptions.selectedCustomerCredit =
					conditionsToShow[0].descricao;
				MZPaymentOptions.updateCustomData(conditionsToShow[0]).then(
					() => {
						vtexjs.checkout.getOrderForm();
					}
				);
			}
		}

		const select = $(
			`<select>${conditionsToShow.map((cond) => {
				return `<option ${
					MZPaymentOptions.selectedCustomerCredit === cond.descricao
				} value="${cond.descricao}">${MZPaymentOptions.getConditionText(
					cond,
					ofValue
				)}</option>`;
			})}</select>`
		).on("change", function (e) {
			//find cond on conditions to show
			MZPaymentOptions.selectedCustomerCredit = e.target.value;
			const cond = conditionsToShow.find(
				(cond) => cond.descricao == e.target.value
			);
			MZPaymentOptions.updateCustomData(cond).then(() => {
				vtexjs.checkout.getOrderForm();
			});
		});

		const html = $(
			`<div class="mz-payment-option-cc"><p class="mz-payment-option-cc-text">Selecione a forma de pagar</p></div>`
		);
		html.append(select);
		MZPaymentOptions.appendHtml(
			".mz-payment-option-cc",
			"#payment-group-creditControlPaymentGroup",
			html
		);
	},
	appendHtml: (wrapperClass, paymentClass, html) => {
		let breaker = 0;
		clearInterval(MZPaymentOptions.interval);
		MZPaymentOptions.interval = setInterval(() => {
			breaker++;
			if (breaker > 10) {
				clearInterval(MZPaymentOptions.interval);
			}
			if (!$(wrapperClass).length) {
				$(wrapperClass).remove();
				const ccDiv = $(paymentClass).parent();
				ccDiv.find(".payment-method").append(html);
			}
		}, 500);
	},
	generateUserPaymentOptions: () => {
		const selectedPaymentGroup = paymentData?.selectedPaymentGroups();
		if (!selectedPaymentGroup.length) return;
		selectedPaymentGroup.forEach((selectedPaymentGroup) => {
			if (selectedPaymentGroup.name == "Customer Credit") {
				MZPaymentOptions.generateCustomerCreditOptions(
					MZPaymentOptions.userPaymentOptions["customerCredit"]
				);
			}
			if (selectedPaymentGroup.name == "Promissory") {
				MZPaymentOptions.generateCustomerPromissoryOptions(
					MZPaymentOptions.userPaymentOptions["customerPromissory"]
				);
			}
		});
	},
	updateCustomData: async (data) => {
		const orderFormId = vtexjs.checkout.orderForm.orderFormId;
		const myHeaders = new Headers();

		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			authorizationGroup: data?.authorizationGroup || "-",
			descricao: data?.descricao || "-",
			tipoNegociacao: data?.tipoNegociacao || "-",
			minOrderValue: data?.minOrderValue || "-",
			minInstallmentValue: data?.minInstallmentValue || "-",
			classificacaoUniWEB: data?.classificacaoUniWEB || "-",
			taxa: data?.taxa || "-",
			repeticao: data?.repeticao || "-",
		});

		const requestOptions = {
			method: "PUT",
			headers: myHeaders,
			body: raw,
		};

		if (data && data.taxa && data.taxa > 0) {
			await fetch(`/_v/checkout_middleware/changeInterests`, {
				method: "PUT",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderFormId: orderFormId,
					interest: data.taxa,
				}),
			});
		} else if (
			vtexjs.checkout.orderForm?.messages?.find(
				(message) => message.code == "changedPriceValue"
			)
		) {
			await fetch(`/_v/checkout_middleware/changeInterests`, {
				method: "DELETE",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderFormId: orderFormId,
					interest: data.taxa,
				}),
			});
		}

		vtexjs.checkout.getOrderForm();

		return fetch(
			`/api/checkout/pub/orderForm/${vtexjs.checkout.orderForm.orderFormId}/customData/mz-custom-options`,
			requestOptions
		);
	},
};

function appendProductRefToCheckoutItems() {
	setTimeout(() => {
		const { items } = vtexjs.checkout.orderForm;

		items.forEach(({ id, productRefId }) => {
			const selectors = [
				{
					element: `tr[data-sku="${id}"] a#product-name${id}`,
					appendMethod: "append",
				},
				{
					element: `li[data-sku="${id}"] .description`,
					appendMethod: "prepend",
				},
			];

			selectors.forEach(({ element, appendMethod }) => {
				const $element = $(element);
				if ($element.find(".product-ref").length === 0) {
					$element[appendMethod](
						`<span class="product-ref">Código do Produto: ${productRefId}</span>`
					);
				}
			});
		});
	}, 1000);
}

window.addEventListener("DOMContentLoaded", () => {
	$(window).on("orderFormUpdated.vtex", () => {
		appendProductRefToCheckoutItems();
	});

	$(window).on("hashchange", () => {
		appendProductRefToCheckoutItems();
	});
});

function appendQuoteButton() {
	const quoteButton = `
	<a href="/b2b-quotes/create" class="btn btn-large btn-success btn-quote ">
	  <span>Salvar carrinho</span>
	</a>
  `;

	$(".cart-links").append(quoteButton);
}

function appendDisclaimer() {
	const disclaimer = `<div class="checkout-total-disclaimer">*Total sem impostos.</div>`;

	$(".accordion-group").append(disclaimer);
}

window.addEventListener("DOMContentLoaded", () => {
	appendQuoteButton();
	appendDisclaimer();
});

$('body').on('click', 'a.srp-address-title', function(e) {
    e.preventDefault();
	e.stopPropagation();
})
