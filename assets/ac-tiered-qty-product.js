ACDiscountApp.PDPage.DisplayTiers = function () {
  var tabelSelectorPDpage = '.product-form form[action="/cart/add"],form[action="/cart/add"] .product-form-buttons ,.js.shopify-design-mode .product__info-wrapper .product-form__buttons'; // Tiered Table Selector;
  var tabelQuantitySelectorPDpage = 'quantity-input input[name="quantity"],.product-form-buttons quantity-selector-component input[name="quantity"]';// add quantity box selecter
  var addToCartSelecter = '.product-form .product-form__buttons button[name="add"],.product-form-buttons  button[name="add"]';// add t cart button selecter
  var VarintChangeSelectorPDpage = '.js.product-form__input label,.variant-picker__form label';
  //
  var storeTime = globalFields.Storetime();
  // Parse the date string into individual components
  let [currentYear, currentMonth, currentDay, currentHours, currentMinutes, currentSeconds] = storeTime.split(/[\sT:-]/);
  currentYear = parseInt(currentYear);
  currentMonth = parseInt(currentMonth); // Months are zero-based in JavaScript
  currentDay = parseInt(currentDay);
  currentHours = parseInt(currentHours);
  currentMinutes = parseInt(currentMinutes);
  currentSeconds = parseInt(currentSeconds);

  function makeTimer(end_date) {
    if (globalFields.isProduct_Page) {
      if (end_date != null) {
        jQuery("#ac_countDown").css("display", "block");
        var endTime = end_date;
        // Increment seconds by 1
        currentSeconds++;

        // Adjust minutes, hours, and day if necessary
        if (currentSeconds >= 60) {
          currentSeconds = 0;
          currentMinutes++;
          if (currentMinutes >= 60) {
            currentMinutes = 0;
            currentHours++;
            if (currentHours >= 24) {
              currentHours = 0;
              currentDay++;
            }
          }
        }

        // Reformat the updated timestamp
        let currentStoreTime = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}T${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')}`;
        endTime = (Date.parse(endTime) / 1000);
        var now = currentStoreTime;
        now = (Date.parse(now) / 1000);
        var timeLeft = endTime - now;
        var days = Math.floor(timeLeft / 86400);
        var hours = Math.floor(timeLeft / 3600);
        var exactHour = hours % 24;
        var minutes = Math.floor((timeLeft - (hours * 3600)) / 60);
        var seconds = Math.floor((timeLeft - (hours * 3600) - (minutes * 60)));
        var isDays = false;
        if (days > 0 || hours > 24) { isDays = true; }
        if (days < 0) { days = "00"; /*hours = "0"; minutes = "0"; seconds = "0";*/ }
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        if (timeLeft > 0) {
          if (isDays) {
            $(".ac__days").html(days); $(".ac__hours").html(exactHour); $(".ac__minutes").html(minutes);
            $(".ac_sec, .ac__colon.seconds").hide();
          }
          else {
            $(".ac__hours").html(exactHour); $(".ac__minutes").html(minutes); $(".ac__seconds").html(seconds);
            $(".ac_day, .ac__colon.hours").hide(); $(".ac_sec, .ac__colon.seconds").show();
          }
        }
        else { jQuery('.ac__settings__table, #ac_countDown').remove(); }

        setTimeout(function () {
          jQuery('.ac__settings__table').after(jQuery("#ac_countDown"));
        }, 500);
      }
    }
  }

  var hide_buttons = null;
  var HideAdditionalPayments = function () {
    hide_buttons = setInterval(function () {
      if (jQuery('.shopify-payment-button__button').length > 0) {
        jQuery('.shopify-payment-button__button').hide();
        clearInterval(hide_buttons);
      }
    }, 500);
  }

  this.DisplayTiersFn = function () {
    setTimeout(function () {
      jQuery('.ac__settings__table').remove();
      var selectedVariant = jQuery('input[name^=id]:checked, select[name^=id], input[name=id], hidden[name^=id]', jQuery('form[action="/cart/add"]')).val();
      let ProductPage = globalFields.TableProductPage != undefined && globalFields.TableProductPage != '' ? globalFields.TableProductPage : 'true';
      ProductPage = ProductPage == 'true' ? true : false;
       var selectedVariantnew =  jQuery('input[type=radio][data-variant-id]:checked').data('variant-id');
       if(selectedVariant && selectedVariantnew == Number(selectedVariant)){
        selectedVariant = selectedVariant;
        }else if(selectedVariantnew){
         selectedVariant = selectedVariantnew;
        }else{
         selectedVariant = globalFields.current_variant
        }
      
      if (selectedVariant != null && globalFieldsProductPage_AC.productMetafield != '[]' && globalFieldsProductPage_AC.productMetafield != undefined && ProductPage) {
        let tierObj = globalFields.GetTierObject(globalFieldsProductPage_AC.productMetafield, selectedVariant);
        if(!tierObj){
        return;
        }
        let DiscountAppliedOn = false;
        let Location_Tag_s = false;
        if (tierObj != undefined) {
          DiscountAppliedOn = tierObj.DiscountAppliedON != null && tierObj.DiscountAppliedON != '' && tierObj.DiscountAppliedON != undefined ? true : false;
          Location_Tag_s =  false;
        }
        if (DiscountAppliedOn) {
          // 1
          if (Location_Tag_s) {
            // 2
            let DiscountAppliedOnTag = tierObj.DiscountAppliedON == 'Both_Store' || tierObj.DiscountAppliedON == 'Online_Store' ? true : false;

            let LocationObject = Object.keys(tierObj.Location_Tag_);
            if (LocationObject[0] == 'StoreLocation') {
              let StoreLocationcheck = tierObj.Location_Tag_[LocationObject[0]].includes(globalFields.Storecountry) || tierObj.Location_Tag_[LocationObject[0]].includes(globalFields.Storecity) ? true : false;
              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date) && DiscountAppliedOnTag && StoreLocationcheck) {
                var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
                getDates.valid; getDates.start_date; getDates.end_date;
                let timer_settings = parsed_timer_settings;
                WriteTableHeading(tierObj);
                WriteTableRows(tierObj, selectedVariant);
                if (timer_settings != undefined) {
                  if (timer_settings.TimerStatus) {
                    if (getDates.valid) {
                      setInterval(function () { makeTimer(getDates.end_date); }, 1000);
                    }
                  }
                }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function () {
                  jQuery('.shopify-payment-button__button').hide();
                  HideAdditionalPayments();
                }, 2000);
                setTimeout(function () {
                  clearInterval(hide_buttons);
                }, 5000);
              }
            }
            else {
              // 3
              let TierLocation = tierObj.Location_Tag_[LocationObject[0]];
              let CusotmerCountryLocation = globalFields.Customercountry;
              let CusotmerCityLocation = globalFields.Customercity;
              let CustomerLocationcheck_1 = (arr, arr1) => { return arr.some(item => arr1.includes(item)) };
              let CustomerLocationcheck_2 = (arr2, arr3) => { return arr2.some(item => arr3.includes(item)) };
              let CityValue = CustomerLocationcheck_1(TierLocation, CusotmerCountryLocation);
              let CountryValue = CustomerLocationcheck_2(TierLocation, CusotmerCityLocation);

              if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date) && DiscountAppliedOnTag && (CityValue || CountryValue)) {
                var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
                getDates.valid; getDates.start_date; getDates.end_date;
                let timer_settings = parsed_timer_settings;
                WriteTableHeading(tierObj);
                WriteTableRows(tierObj, selectedVariant);
                if (timer_settings != undefined) {
                  if (timer_settings.TimerStatus) {
                    if (getDates.valid) {
                      setInterval(function () { makeTimer(getDates.end_date); }, 1000);
                    }
                  }
                }
                jQuery('.shopify-payment-button__button').hide();
                setTimeout(function () {
                  jQuery('.shopify-payment-button__button').hide();
                  HideAdditionalPayments();
                }, 2000);
                setTimeout(function () {
                  clearInterval(hide_buttons);
                }, 5000);
              }
            }

          }
          else {
            // 4
            if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date) && (tierObj.DiscountAppliedON == 'Both_Store' || tierObj.DiscountAppliedON == 'Online_Store')) {
              var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
              getDates.valid; getDates.start_date; getDates.end_date;
              let timer_settings = undefined//parsed_timer_settings;                
              WriteTableHeading(tierObj);
              WriteTableRows(tierObj, selectedVariant);
              if (timer_settings != undefined) {
                if (timer_settings.TimerStatus) {
                  if (getDates.valid) {
                    setInterval(function () { makeTimer(getDates.end_date); }, 1000);
                  }
                }
              }
              jQuery('.shopify-payment-button__button').hide();
              setTimeout(function () {
                jQuery('.shopify-payment-button__button').hide();
                HideAdditionalPayments();
              }, 2000);
              setTimeout(function () {
                clearInterval(hide_buttons);
              }, 5000);
            }
          }
        }
        else {
          // 5
          let temptimer = globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date)
          if (tierObj != undefined && tierObj.status && globalFields.StartEndDateValid(tierObj.start_date, tierObj.end_date)) {
            var getDates = globalFields.TimerStartEndDateValid(tierObj.start_date, tierObj.end_date);
            getDates.valid; getDates.start_date; getDates.end_date;
            let timer_settings = undefined//parsed_timer_settings;                
            WriteTableHeading(tierObj);
            WriteTableRows(tierObj, selectedVariant);
            if (timer_settings != undefined) {
              if (timer_settings.TimerStatus) {
                if (getDates.valid) {
                  setInterval(function () { makeTimer(getDates.end_date); }, 1000);
                }
              }
            }
            jQuery('.shopify-payment-button__button').hide();
            setTimeout(function () {
              jQuery('.shopify-payment-button__button').hide();
              HideAdditionalPayments();
            }, 2000);
            setTimeout(function () {
              clearInterval(hide_buttons);
            }, 5000);
          }
        }
      }
    }, 200);

  }


  setTimeout(function () {
    clearInterval(hide_buttons);
  }, 10000);

  this.OnVariantChange = function () {

  }
  document.addEventListener('click', function (event) {
  if (event.target.closest(VarintChangeSelectorPDpage)) {
    setTimeout(function () {
      displayTiers.DisplayTiersFn();
    }, 1000);
  }
});
  

  var TableHeadHtml = function (contentHtml, tableSelector, position) {
    let tableShowAfter = false;
   jQuery(tableSelector)[globalFields.settings.table_body.table_placed == 'after' ? 'after' : 'before'](contentHtml);
  }

  var WriteTableHeading = function (tierObj) {
    var tableSelector = tabelSelectorPDpage;
    if (globalFields.settings.selected_table == "table1") {
      TableHeadHtml('<table class="ac__settings__table ac_table1" id="ac_table1"><tbody class="ac__tbody"><tr class="ac__tr ac__tr1"><th class="ac__th ac__th1" style=" word-break: auto-phrase; " >' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2" style=" word-break: auto-phrase; " >' + globalFields.settings.table_headers.header2_value + '</th></tr></tbody></table>', tableSelector);
    }
    if (globalFields.settings.selected_table == "table2") {

      TableHeadHtml('<table class="ac__settings__table ac_table2" id="ac_table2"><tbody class="ac__tbody"><tr class="ac__tr ac__tr1"><th class="ac__th ac__th1" style=" word-break: auto-phrase; " >' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2" style=" word-break: auto-phrase; ">' + globalFields.settings.table_headers.header2_value + '</th><th class="ac__th ac__th3" style=" word-break: auto-phrase; " >' + globalFields.settings.table_headers.header3_value + '</th></tr></tbody></table>', tableSelector);
    }

    if (globalFields.settings.selected_table == "table3") {
      TableHeadHtml('<table class="ac__settings__table ac_table3" id="ac_table3"><tbody class="ac__tbody"><tr class="ac__tr ac__tr1"><th class="ac__th ac__th1" style=" word-break: auto-phrase; ">' + globalFields.settings.table_headers.header1_value + '</th><th class="ac__th ac__th2" style=" word-break: auto-phrase; " >' + globalFields.settings.table_headers.header2_value + '</th><th class="ac__th ac__th3" style=" word-break: auto-phrase; ">' + globalFields.settings.table_headers.header3_value + '</th></tr></tbody></table>', tableSelector);
    }

    if (globalFields.settings.selected_table == "table4") {
      TableHeadHtml('<table class="ac__settings__table ac_table4" id="ac_table4"><tbody class="ac__tbody"></tbody></table>', tableSelector);
    }
        if (globalFields.settings.selected_table == "table5") {
    TableHeadHtml('<div class="ac__settings__table ac_table5" id="ac_table5" style="border: none;"><div class="ac__tbody"></div></div>',tableSelector);
    }
  }

  var TableRowHtml = function (contentHtml, tableSelector) {
    jQuery(tableSelector).append(contentHtml);
  }
    function formatNumberWithCommas(number) {
  if (typeof number !== 'number') {
    return number;
  }
  return number;
  }

 var TableRowSingle = function (tieredMin_, tieredMax_, discountedPrice, tieredOff,mostPopularValues, index,originalPrice_,lastLength) {   
      let mostPopular = mostPopularValues ? `<br><span class="ac_mostpopuler">Most Popular</span>` : '';
      var plusSign = tieredMin_ == tieredMax_ ? '' : '+', buyText = 'Buy ';
      var priceHtml = '<span class="money ac_money" data-currency-' + globalFields.currency.toLowerCase() + '="' + globalFields.currencySymbol + discountedPrice + '" data-currency="' + globalFields.currency + '">' + globalFields.formatMoney(discountedPrice, globalFields.amount) + '</span>';
  
   if (globalFields.settings.selected_table == "table1") {
        TableRowHtml('<tr class="ac__tr ac__tr' + (index + 1) + '"> <td class="ac__td ac__td1">' + tieredMin_ + plusSign + mostPopular + '</td><td class="ac__td ac__td2">' + tieredOff + '</td></tr>', '#ac_table1 .ac__tbody');
    }
   
    if (globalFields.settings.selected_table == "table2") {
        TableRowHtml('<tr class="ac__tr ac__tr' + (index + 1) + '"> <td class="ac__td ac__td1">' + tieredMin_ + mostPopular + '</td><td class="ac__td ac__td2">' + tieredMax_ + '</td><td class="ac__td ac__td3">' + tieredOff + '</td></tr>', '#ac_table2 .ac__tbody');
    }

    if (globalFields.settings.selected_table == "table3") {
        TableRowHtml('<tr class="ac__tr ac__tr' + (index + 1) + '"> <td class="ac__td ac__td1">'+ globalFields.settings.table_body.body1_value +' ' + tieredMin_ + plusSign + mostPopular + '</td><td class="ac__td ac__td2">' + priceHtml + '</td><td class="ac__td ac__td3">' + tieredOff + '</td></tr>', '#ac_table3 .ac__tbody');
    }

    if (globalFields.settings.selected_table == "table4") {
      var quantityTextTable4 = tieredMin_ + "-" + tieredMax_;
      if (tieredMax_ == "+") {
        quantityTextTable4 = tieredMin_ + "+";
      }
      TableRowHtml('<tr class="ac__tr ac__tr' + index + '"> <td class="ac__td ac__td1">' + globalFields.settings.table_body.body1_value + ' ' + tieredMin_ + ' ' + globalFields.settings.table_body.body2_value + ' ' + tieredOff + '</td></tr>', '#ac_table4');
    }

      if (globalFields.settings.selected_table == "table5") {
        let grabThisdealBtn = lastLength == index ?  `<button class="ac_grab_deal_btn ac__th" type="button" > ${ globalFields.settings.table_body.body2_value} </button>`: "" ;
          TableRowHtml('<div class="ac_main_container ac__td"> <div class="ac_offer-option-item"> <label for="'+ tieredMin_+'" id="label_card_'+ (index + 1) + '"> <input type="radio" name="card_group" value="'+ tieredMin_ + '" class="ac-quantity-input-box tier_value" aria-labelledby="label_card_'+ (index + 1) + '" data-gtm-form-interact-field-id="'+ (index + 1) + '" />  </label> </div> <div class="ac_offer-option"> <div>  <span>'+ globalFields.settings.table_body.body1_value +' '+ formatNumberWithCommas(tieredMin_) +' ' + globalFields.settings.table_headers.header2_value + ' </span>  <span class="money ac_money">'+ tieredOff + '</span>  <span>' + globalFields.settings.table_headers.header3_value +  '</span>'+mostPopular+'</div>  </div> <div class="ac_offer-option_price"> <div class="ac_option-item-price"> <div class="ac_item-regular_price"> <span class="money ac_money">'+ tieredOff + '</span> <s class="money ac_money">'+globalFields.formatMoney(originalPrice_*100, globalFields.amount)+'</s> </div> </div> <div class="ac_option-total-price"> <div class="ac_item-regular_price"> <div class="ac-total-price"> '+ globalFields.settings.table_headers.header1_value +'</div> <s class="money ac_money">' +globalFields.formatMoney( (tieredMin_ * originalPrice_).toFixed(2) , globalFields.amount) +'</s> <span class="money ac_money">  ' + globalFields.formatMoney((tieredMin_ *Number(discountedPrice)).toFixed(2) , globalFields.amount) +'</span> </div> </div> </div> </div>'+ grabThisdealBtn +' ', '#ac_table5 .ac__tbody');
        if(lastLength == index){GrabThisDeal()}
      }

  }

  var WriteTableRows = function (tierObj, selectedVariant_) {
    var originalPrice_ = globalFieldsProductPage_AC.variantsPriceArray_PD[selectedVariant_]; originalPrice_ = originalPrice_ / 100;
    for (i = 0; i < tierObj.tier_min.length; i++) {
      var isBreakLoop = false, tieredOff = Number(tierObj.tier_values[i]);
      var tieredMin_ = parseInt(tierObj.tier_min[i]), tieredMax_ = tierObj.tier_max[i], discountedPrice = 0;

      if (tieredMax_ != "max") {
        tieredMax_ = parseInt(tieredMax_);
      }
      else {
        tieredMax_ = "+";
      }

      if (tierObj.discount_type == "percentage") {
        discountedPrice = Number(originalPrice_.toFixed(2));
        var p = parseFloat(tieredOff) / 100, originalPriceCut_ = Number(parseFloat(p * discountedPrice).toFixed(2));
        discountedPrice = discountedPrice - originalPriceCut_;
        if (discountedPrice <= 0) {
          discountedPrice = 0;
          tieredOff = "100%";
          isBreakLoop = true;
          tieredMax_ = "+";
        }
        else {
          discountedPrice = discountedPrice.toFixed(2);
          tieredOff = tieredOff + "% OFF";
        }
      }
      else if (tierObj.discount_type == "fixed_price") {
        discountedPrice = tieredOff.toFixed(2);
        tieredOff = globalFields.formatMoney(tieredOff.toFixed(2), globalFields.amount);
      }
      else {
        discountedPrice = Number((originalPrice_ - tieredOff).toFixed(2));
        if (discountedPrice <= 0) {
          discountedPrice = 0;
          tieredOff = globalFields.formatMoney(originalPrice_.toFixed(2), globalFields.amount);
          isBreakLoop = true;
          tieredMax_ = "+";
        }
        else {
          discountedPrice = discountedPrice.toFixed(2);
          tieredOff = globalFields.formatMoney(tieredOff.toFixed(2), globalFields.amount) + " OFF";
        }
      }
      let lastLength = isBreakLoop ?  i + 1 : tierObj.tier_min.length
      let booleanmostPopularValues = tierObj.mostPopularValues != undefined ? (tierObj.mostPopularValues[i] != undefined ? tierObj.mostPopularValues[i] : false) : false;
        if(discountedPrice > 0 && Number(originalPrice_) >= Number(discountedPrice)){
             TableRowSingle(tieredMin_, tieredMax_, discountedPrice, tieredOff,booleanmostPopularValues, i + 1,originalPrice_,lastLength);
        }
     

      if (isBreakLoop) { break; }
    }
    
    let tableSize = $(`.ac_${globalFields.settings.selected_table} .ac__tbody tr`).length
    if(tableSize == 1 && globalFields.settings.selected_table != 'table5' && globalFields.settings.selected_table != 'table4' ){$(`.ac_${globalFields.settings.selected_table}`).hide();}
            // hide table if discount is greter then product price 
          // let tableSize = $(`.ac_${globalFields.settings.selected_table} .ac__tbody tr`).length
          // if(tableSize == 1){$(`.ac_${globalFields.settings.selected_table}`).hide();}
  }
  
var GrabThisDeal = function () {
    let quantityInputContainer = document.querySelector(tabelQuantitySelectorPDpage)
    let radioBtnValue = document.querySelector(".ac-quantity-input-box")
    let acMainContainer = document.querySelector(".ac_main_container")
    let quantityInputValue = radioBtnValue.value;
    radioBtnValue.checked = true
    acMainContainer.classList.add('ac-active')
   if(quantityInputContainer){
    quantityInputContainer.value = quantityInputValue
  }
    $(".ac_main_container").on("click", function () {
      quantityInputContainer = document.querySelector(tabelQuantitySelectorPDpage)
        quantityInputValue = $(this).find(".ac-quantity-input-box").val();
     
        //quantityInputContainer.value = quantityInputValue // uncomment this if wants to show tier value on the click of ac_main_container
        $(this).find(".ac-quantity-input-box").prop("checked", true)

        if (!document.querySelector(".ac-quantity-input-box").checked) {
            radioBtnValue.style.backgroundColor = "";
            acMainContainer.style.backgroundColor = ""
          //acMainContainer[0].classList.remove('ac-active')
        }
      
       // Toggle 'active' class on containers
        $(".ac_main_container").removeClass('ac-active');
        $(this).addClass('ac-active');

    });

        // Event listener for grab deal button
    jQuery('.ac_grab_deal_btn').click(function () {
      quantityInputContainer = document.querySelector(tabelQuantitySelectorPDpage)
      if(quantityInputContainer){
        quantityInputContainer.value = quantityInputValue
      }
   // Optionally trigger the add to cart button
      if(globalFields.settings.table_body.gtd_add_to_cart){
    $(addToCartSelecter).click(); // Uncomment and ensure the selector is correct
        
      }
});
  
}

}

var globalFieldsProductPage_AC = new ACDiscountApp.PDPage.Global(), displayTiers = new ACDiscountApp.PDPage.DisplayTiers();
displayTiers.DisplayTiersFn(); displayTiers.OnVariantChange();