
	// ID of the Google Spreadsheet
	var spreadsheetID = "18nTKQ8X7RijCCjFKojpEY3boUDrWvtMeT8j7v49jnVA";
   
	// Make sure it is public or set to Anyone with link can view 
  var url = "https://spreadsheets.google.com/feeds/cells/" + spreadsheetID + "/1/public/values?alt=json";

// both getUrlVars & getUrlParam to get the URL Variables. 
// usage example: 
//    https://html-online.com/?x=1&text=hello
//    var mytext = getUrlParam('text','Empty');
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
  });
  return vars;
}
function getUrlParam(parameter, defaultvalue){
  var urlparameter = defaultvalue;
  if(window.location.href.indexOf(parameter) > -1){
      urlparameter = getUrlVars()[parameter];
      }
  return urlparameter;
}


function loadCategorySidebar(loadCategory =  1, loadProductPanel = 1, loadSidebar = 0) {
	$.getJSON(url, function(json) {
    if(loadCategory) {
      processCategoryMenu(json);
    }
    if(loadProductPanel) {
     processProductPanel(json);
     processBannerItem(json);
    }
    if(loadSidebar) {
      processCategorySideBar(json);
    }
    spreadSheetLoaded = 1;
  });
}
function processCategoryMenu(json) {
  var entry = json.feed.entry;
  var categoryString = '<ul class="cat_menu">';
  var previousCategoryJson = 0;
  

  $(entry).each(function(){
    // console.log("test123 " + this.content.$t);

    // row 2~19, categories
    if(this.gs$cell.row > 1 && this.gs$cell.row <20) {
      switch (this.gs$cell.col) {
        case "1":
        // categories
          var category_json = JSON.parse(this.content.$t);
          // console.log("category [" + category_json.desc + "][" + category_json.page + "][" + category_json.link + "]");        

          if(previousCategoryJson) {
            categoryString = categoryString + '  <li><a href=shop.html?page=' + previousCategoryJson.page + '>'+  previousCategoryJson.desc +'<i class="fas fa-chevron-right ml-auto"></i></a></li>';
          }
          // store as previous category json, to be added next round
          previousCategoryJson = JSON.parse(this.content.$t);
          break;
        case "2":
          // second row onwards, subcategories
          var subcategoriesJson = JSON.parse(this.content.$t);
          var subcategoriesJson_content = subcategoriesJson.subcategories;

          categoryString = categoryString + '  <li class="hassubs">';
          categoryString = categoryString + '    <a href=shop.html?page=' + previousCategoryJson.page + '>'+  previousCategoryJson.desc +'<i class="fas fa-chevron-right ml-auto"></i></a>';
          categoryString = categoryString + '    <ul>';

          $(subcategoriesJson_content).each(function(){
            // console.log("subcategory [" + this.desc + "][" + this.page + "][" + this.link + "]");
            categoryString = categoryString + '      <li><a href=shop.html?page=' + this.page + '>'+ this.desc +'<i class="fas fa-chevron-right"></i></a></li>';
          })
          categoryString = categoryString + '    </ul>';
          categoryString = categoryString + '  </li>';

          // clear previousCategoryJson
          previousCategoryJson = 0;
          break;
        default: 
          break;
      }
    }

  });

  if(previousCategoryJson) {
    categoryString = categoryString + '  <li><a href=shop.html?page=' + previousCategoryJson.page + '>'+  previousCategoryJson.desc +'<i class="fas fa-chevron-right ml-auto"></i></a></li>';
  }

  categoryString = categoryString + '</ul>';

  // console.log("test123 " + categoryString);
  $("#category_menu_content").append(categoryString);
}

function processProductPanel(json) {
   
  var entry = json.feed.entry;
  var productNameValue = 0;
  var productPriceValue = 0;
  var discountedPriceValue = 0;
  var discountedFlagValue = 0;
  var newFlagValue = 0;
  var image1Value = 0;
  var linkValue = 0;
  var productPageNum = 0;
  var productRowNum = 0;
  var productString = "";
  var productCategoryString = "";

  var tab1Added = 0;
  var tab2Added = 0;
  var tab3Added = 0;


  $(entry).each(function(){
    // Load Category Information
    if(this.gs$cell.row == 30 && this.gs$cell.col== 1) { 
      productCategoryString = '<li class="active">' + this.content.$t + '</li>';
      $("#new_arrival_categories").append(productCategoryString);
    } else if(this.gs$cell.row == 50  && this.gs$cell.col== 1) {
      productCategoryString = '<li>' + this.content.$t + '</li>';
      $("#new_arrival_categories").append(productCategoryString);
    } else if(this.gs$cell.row == 70  && this.gs$cell.col== 1) {
      productCategoryString = '<li>' + this.content.$t + '</li>';
      $("#new_arrival_categories").append(productCategoryString);
    }
   
    // Load Product Information
    // Line 30-50, tab 1
    if(this.gs$cell.row > 30 && this.gs$cell.row <50 ) {
      if(tab1Added == 0) {
        tab1Added = 1;
        productString += '<div class="product_panel panel active">';
        productString += '  <div class="arrivals_slider slider">';
      }

      switch (this.gs$cell.col) {
        case "3":
          productNameValue = this.content.$t;
          break;
        case "6":
          productPriceValue = this.content.$t;
          break;
        case "7":
          discountedPriceValue = this.content.$t;
          break;
        case "8":
          discountedFlagValue = this.content.$t;
          break;
        case "9":
          newFlagValue = this.content.$t;
          break;
        case "10":
          image1Value = this.content.$t;
          break;
        case "13":
          productPageNum = this.content.$t;
          break;
        case "14":
          productRowNum = this.content.$t;

          if (this.gs$cell.row == 31) {
            $("#arrival_single_item").append(constructArrivalSingleItemString(image1Value, discountedFlagValue?discountedPriceValue:productPriceValue, 
              productPageNum, productRowNum, productNameValue, discountedFlagValue, newFlagValue));
          } else {
            productString += constructSliderItemString(image1Value, discountedFlagValue?discountedPriceValue:productPriceValue, 
              productPageNum, productRowNum, productNameValue, discountedFlagValue, newFlagValue);              
          }
          break;
        default:
          break;
      }
    }

    if(this.gs$cell.row > 50 && this.gs$cell.row <70 ) {
      if(tab1Added == 1) {
        tab1Added = 0;
        productString += '    </div>';
        productString += '  <div class="arrivals_slider_dots_cover"></div>';
        productString += '</div>';
      }
      if(tab2Added == 0) {
        tab2Added = 1;
        productString += '<div class="product_panel panel">';
        productString += '  <div class="arrivals_slider slider">';
      }

      switch (this.gs$cell.col) {
        case "3":
          productNameValue = this.content.$t;
          break;
        case "6":
          productPriceValue = this.content.$t;
          break;
        case "7":
          discountedPriceValue = this.content.$t;
          break;
        case "8":
          discountedFlagValue = this.content.$t;
          break;
        case "9":
          newFlagValue = this.content.$t;
          break;
        case "10":
          image1Value = this.content.$t;
          break;
        case "13":
          productPageNum = this.content.$t;
          break;
        case "14":
          productRowNum = this.content.$t;

          productString += constructSliderItemString(image1Value, discountedFlagValue?discountedPriceValue:productPriceValue, 
            productPageNum, productRowNum, productNameValue, discountedFlagValue, newFlagValue);
            break;
        default:
          break;
      }
    }
    
    if(this.gs$cell.row > 70 && this.gs$cell.row <90 ) {
      if(tab2Added == 1) {
        tab2Added = 0;
        productString += '    </div>';
        productString += '  <div class="arrivals_slider_dots_cover"></div>';
        productString += '</div>';

      }
      if(tab3Added == 0) {
        tab3Added = 1;
        productString += '<div class="product_panel panel">';
        productString += '  <div class="arrivals_slider slider">';
      }

      switch (this.gs$cell.col) {
        case "3":
          productNameValue = this.content.$t;
          break;
        case "6":
          productPriceValue = this.content.$t;
          break;
        case "7":
          discountedPriceValue = this.content.$t;
          break;
        case "8":
          discountedFlagValue = this.content.$t;
          break;
        case "9":
          newFlagValue = this.content.$t;
          break;
        case "10":
          image1Value = this.content.$t;
          break;
        case "13":
          productPageNum = this.content.$t;
          break;
        case "14":
          productRowNum = this.content.$t;

          productString += constructSliderItemString(image1Value, discountedFlagValue?discountedPriceValue:productPriceValue, 
            productPageNum, productRowNum, productNameValue, discountedFlagValue, newFlagValue);
          break;
        default:
          break;
      }
    }
  
  });

  if(tab1Added == 1) {
    tab1Added = 0;
    productString += '    </div>';
    productString += '  <div class="arrivals_slider_dots_cover"></div>';
    productString += '</div>';

  }
  if(tab2Added == 1) {
    tab2Added = 0;
    productString += '    </div>';
    productString += '  <div class="arrivals_slider_dots_cover"></div>';
    productString += '</div>';

  }
  if(tab3Added == 1) {
    tab3Added = 0;
    productString += '    </div>';
    productString += '  <div class="arrivals_slider_dots_cover"></div>';
    productString += '</div>';
  }
  $("#product_panel_content").append(productString);
}

function constructSliderItemString(imageString, priceString, productPageNumber, productRowNumber, productNameString, productDiscountFlag, productNewFlag) {
  var productString = 0;

  productString  = '<div class="arrivals_slider_item">'
  productString += '  <div class="border_active"></div>';
  productString += '  <div class="product_item is_new d-flex flex-column align-items-center justify-content-center text-center">';
  productString += '    <div class="product_image d-flex flex-column align-items-center justify-content-center"><img src="'+ imageString+ '" alt=""></div>';
  productString += '    <div class="product_content">';
  productString += '      <div class="product_price">'+ priceString+'</div>';
  productString +=  '      <div class="product_name"><div><a href="product.html?page='+ productPageNumber + '&item=' + productPageNumber + '">'+ productNameString+ '</a></div></div>';
  productString += '      <div class="product_extras">';
  productString += '        <button class="product_cart_button">Add to Cart</button>';
  productString += '      </div>';
  productString += '    </div>';
  productString += '    <div class="product_fav"><i class="fas fa-heart"></i></div>';
  productString += '    <ul class="product_marks">';
  if(productDiscountFlag) {
    productString += '      <li class="product_mark product_discount"></li>';
  } else if (productNewFlag) {
    productString += '      <li class="product_mark product_new">new</li>';
  } else {
    productString += '      <li class="product_mark"></li>';    
  }
  productString += '    </ul>';
  productString += '  </div>';
  productString += '</div>';
  return productString;
}

function constructArrivalSingleItemString(imageString, priceString, productPageNumber, productRowNumber, productNameString, productDiscountFlag, productNewFlag) {
  var productString = 0;

  productString  = '<div class="arrivals_single clearfix">';
  productString += '  <div class="d-flex flex-column align-items-center justify-content-center">';
  productString += '    <div class="arrivals_single_image"><img src="'+ imageString+ '" alt=""></div>';
  productString += '    <div class="arrivals_single_content">';
  productString += '      <div class="arrivals_single_category"><a href="product.html?page='+ productPageNumber + '&item=' + productPageNumber + '">'+ productNameString+ '</a></div>';
  productString += '      <div class="arrivals_single_name_container clearfix">';
  productString += '        <div class="arrivals_single_name"><a href="product.html?page='+ productPageNumber + '&item=' + productPageNumber + '">'+ productNameString+ '</a></div>';
  productString += '        <div class="arrivals_single_price text-right">'+ priceString+'</div>';
  productString += '      </div>';
  productString += '      <div class="rating_r rating_r_4 arrivals_single_rating"><i></i><i></i><i></i><i></i><i></i></div>';
  productString += '      <form action="product.html?page='+ productPageNumber + '&item=' + productPageNumber + '"><button class="arrivals_single_button">Explore</button></form>';
  productString += '    </div>';
  productString += '    <div class="arrivals_single_fav product_fav active"><i class="fas fa-heart"></i></div>';
  productString += '    <ul class="arrivals_single_marks product_marks">';
  if(productDiscountFlag) {
    productString += '      <li class="arrivals_single_mark product_mark product_discount"></li>';
  } else if (productNewFlag) {
    productString += '      <li class="arrivals_single_mark product_mark product_new">new</li>';
  } else {
    productString += '      <li class="arrivals_single_mark product_mark"></li>';    
  }
  productString += '    </ul>';
  productString += '  </div>';
  productString += '</div>';

  return productString;
}

function constructBannerItemString(image1Value, productPageNum, productDescription, productRowNum, productNameValue) {
  var productString = "";
  productString =  '<div class="owl-item">';
  productString += '  <div class="banner_2_item">';
  productString += '    <div class="container fill_height">';
  productString += '      <div class="row fill_height">';
  productString += '        <div class="col-lg-4 col-md-6 fill_height">';
  productString += '           <div class="banner_2_content">';
  productString += '            <div class="banner_2_category">Laptops</div>';
  productString += '            <div class="banner_2_title">' + productNameValue + '</div>';
  productString += '            <div class="banner_2_text">' + productDescription + '</div>';
  productString += '            <div class="rating_r rating_r_4 banner_2_rating"><i></i><i></i><i></i><i></i><i></i></div>';
  productString += '            <div class="button banner_2_button"><a href=product.html?page='+ productPageNum + '&item=' + productRowNum + '>Explore</a></div>';
  productString += '          </div>';
  productString += '        </div>';
  productString += '        <div class="col-lg-8 col-md-6 fill_height">';
  productString += '          <div class="banner_2_image_container">';
  productString += '            <div class="banner_2_image"><img src="' + image1Value + '" alt=""></div>';
  productString += '          </div>';
  productString += '        </div>';
  productString += '      </div>';
  productString += '    </div>';
  productString += '  </div>';
  productString += '</div>';

  return productString;
}



function processBannerItem(json) {
   
  var entry = json.feed.entry;
  var productNameValue = 0;
  var productDescription = "";
  var productPriceValue = 0;
  var discountedPriceValue = 0;
  var discountedFlagValue = 0;
  var newFlagValue = 0;
  var image1Value = 0;
  var linkValue = 0;
  var productPageNum = 0;
  var productRowNum = 0;
  var productString = "";
  var productCategoryString = "";


  $(entry).each(function(){
    // Load Product Banner
    // Line 30-50, tab 1
    if(this.gs$cell.row > 90 && this.gs$cell.row <100 ) {

      switch (this.gs$cell.col) {
        case "3":
          productNameValue = this.content.$t;
          break;
        case "4": // Product Description
          productDescription = this.content.$t + "<BR>";
          break;
        case "5": // Product Description 2
          productDescription = this.content.$t + "<BR>";
          break;
        case "6":
          productPriceValue = this.content.$t;
          break;
        case "7":
          discountedPriceValue = this.content.$t;
          break;
        case "8":
          discountedFlagValue = this.content.$t;
          break;
        case "9":
          newFlagValue = this.content.$t;
          break;
        case "10":
          image1Value = this.content.$t;
          break;
        case "13":
          productPageNum = this.content.$t;
          break;
        case "14":
          productRowNum = this.content.$t;

          productString = constructBannerItemString(image1Value, productPageNum, productDescription, productRowNum, productNameValue);
          $("#banner_slider_item").append(productString);
          
          productNameValue = "";
          productDescription = "";
          productPriceValue = 0;
          discountedPriceValue =0;
          discountedFlagValue =0;
          newFlagValue = 0;
          image1Value = 0;
          productPageNum = 0;
          productRowNum = 0;

          break;
        default:
          break;
      }
    }
  });
}


function processCategorySideBar(json) {
  var entry = json.feed.entry;
  var categoryString = '<ul class="cat_menu">';

  $(entry).each(function(){
    // console.log("test123 " + this.content.$t);

    // second row onwards, categories
    if(this.gs$cell.row > 1 && this.gs$cell.row < 20 && this.gs$cell.col==1) {
      // categories
      var category_json = JSON.parse(this.content.$t);
      // console.log("category [" + category_json.desc + "][" + category_json.page + "][" + category_json.link + "]");        

      categoryString = '  <li><a href=shop.html?page=' + category_json.page + '>'+  category_json.desc +'</a></li>';
      $("#sidebar_categories_item").append(categoryString);
    }
  });
}

function loadProductPage(productPageNumber) {

  var urlString = "https://spreadsheets.google.com/feeds/cells/" + spreadsheetID + "/" + productPageNumber + "/public/values?alt=json";
  // console.log("loadProductPage() urlEndpoint = " + urlString);
  var numberOfProducts = 0;

	$.getJSON(urlString, function(json) {
   
    var entry = json.feed.entry;
    var skuValue = 0;
    var brandValue = 0;
    var productNameValue = 0;
    var productDescValue = 0;
    var productDesc2Value = 0;
    var productPriceValue = 0;
    var discountedPriceValue = 0;
    var discountedFlagValue = 0;
    var newFlagValue = 0;
    var image1Value = 0;
    var image_2_value = 0;
    var image_3_value = 0;
    var linkValue = 0;
    var product_row_number = 0;
    var productString = "";

    // Load Title
    $(document).prop('title', json.feed.title.$t);
    $("#home_title_value").text(json.feed.title.$t);


    // Load Product Information
		$(entry).each(function(){

      // second row onwards, SKU
      if(this.gs$cell.row > 1) {
        product_row_number = this.gs$cell.row;
        switch (this.gs$cell.col) {
          case "1":
            // means, finished parsing previous row
            if(skuValue != 0) {
              //   console.log("product here [" +skuValue + "]["  +brandValue + "]["  +productNameValue + "]["  +productDescValue + "][" 
              // + productDesc2Value+ "]["  + productPriceValue+ "]["  +discountedPriceValue + "]["  +discountedFlagValue + "]["
              //   +newFlagValue + "]["  +image1Value + "]["  + image_2_value+ "][" + image_3_value+ "][" + linkValue+ "]");
              numberOfProducts++;
              if(newFlagValue != 0) {
                productString =  '<div class="product_item is_new">';  
              } else if (discountedFlagValue != 0) {
                productString =  '<div class="product_item discount">';
              } else {
                productString =  '<div class="product_item">';
              }
              productString   += '	<div class="product_border"></div>';
              if(image1Value != 0) {
                productString += '	<div class="product_image d-flex flex-column align-items-center justify-content-center"><img src="'+ image1Value +'" alt=""></div>';
              } else {
                productString += '	<div class="product_image d-flex flex-column align-items-center justify-content-center"><img src="images/featured_1.png" alt=""></div>';
              }
              productString +=   '	<div class="product_content">';
              if (discountedFlagValue != 0) {
                productString += '		<div class="product_price">' + discountedPriceValue + '<span>' + productPriceValue + '</span></div>';
              } else {
                productString += '		<div class="product_price">' + productPriceValue + '</div>';
              }
              productString +=   '		<div class="product_name"><div><a href=product.html?page='+ productPageNumber + '&item=' + (product_row_number-1) + ' tabindex="0">'+ productNameValue +'</a></div></div>';
              productString +=   '	</div>';
              productString +=   '	<div class="product_fav"><i class="fas fa-heart"></i></div>';
              productString +=   '	<ul class="product_marks">';
              productString +=   '		<li class="product_mark product_discount">-25%</li>';
              productString +=   '		<li class="product_mark product_new">new</li>';
              productString +=   '	</ul>';
              productString +=   '</div>';
              $("#product_item_content").append(productString);

              
              skuValue = 0;
              brandValue = 0;
              productNameValue = 0;
              productDescValue = 0;
              productDesc2Value = 0;
              productPriceValue = 0;
              discountedPriceValue = 0;
              discountedFlagValue = 0;
              newFlagValue = 0;
              image1Value = 0;
              image_2_value = 0;
              image_3_value = 0;
              linkValue = 0;
            }

            // store values
            skuValue = this.content.$t;
            break;
          case "2": 
            brandValue = this.content.$t;
            break;
          case "3":
            productNameValue = this.content.$t;
            break;
          case "4":
            productDescValue = this.content.$t;
            break;
          case "5":
            productDesc2Value = this.content.$t;
            break;
          case "6":
            productPriceValue = this.content.$t;
            break;
          case "7":
            discountedPriceValue = this.content.$t;
            break;
          case "8":
            discountedFlagValue = this.content.$t;
            break;
          case "9":
            newFlagValue = this.content.$t;
            break;
          case "10":
            image1Value = this.content.$t;
            break;
          case "11":
            image_2_value = this.content.$t;
            break;
          case "12":
            image_3_value = this.content.$t;
            break;
          case "13":
            linkValue = this.content.$t;
            break;
          default:
            break;
        }
      }

    });

    // console.log("product here [" +skuValue + "]["  +brandValue + "]["  +productNameValue + "]["  +productDescValue + "][" 
    // + productDesc2Value+ "]["  + productPriceValue+ "]["  +discountedPriceValue + "]["  +discountedFlagValue + "]["
    //   +newFlagValue + "]["  +image1Value + "]["  + image_2_value+ "][" + image_3_value+ "][" + linkValue+ "]");
    if(skuValue != 0) {
      numberOfProducts++;
      if(newFlagValue != 0) {
        productString = '<div class="product_item is_new">';  
      } else if (discountedFlagValue != 0) {
        productString = '<div class="product_item discount">';
      } else {
        productString = '<div class="product_item">';
      }
      productString +=  '	<div class="product_border"></div>';
      if(image1Value != 0) {
        productString +='	<div class="product_image d-flex flex-column align-items-center justify-content-center"><img src="'+ image1Value +'" alt=""></div>';
      } else {
        productString +='	<div class="product_image d-flex flex-column align-items-center justify-content-center"><img src="images/featured_1.png" alt=""></div>';
      }
      productString +=   '	<div class="product_content">';
      
      if (discountedFlagValue != 0) {
        productString += '		<div class="product_price">' + discountedPriceValue + '<span>' + productPriceValue + '</span></div>';
      } else {
        productString += '		<div class="product_price">' + productPriceValue + '</div>';
      }
      productString +=   '		<div class="product_name"><div><a href=product.html?page='+ productPageNumber + '&item=' + product_row_number + ' tabindex="0">'+ productNameValue +'</a></div></div>';
      productString +=   '	</div>';
      productString +=   '	<div class="product_fav"><i class="fas fa-heart"></i></div>';
      productString +=   '	<ul class="product_marks">';
      productString +=   '		<li class="product_mark product_discount">-25%</li>';
      productString +=   '		<li class="product_mark product_new">new</li>';
      productString +=   '	</ul>';
      productString +=   '</div>';
      $("#product_item_content").append(productString);
    }

    // update the number of products here
    $("#shop_product_count_value").text(numberOfProducts.toString());
  
  });

}


function loadSingleProduct(productPageNumber, productItemNumber) {

  var urlString = "https://spreadsheets.google.com/feeds/cells/" + spreadsheetID + "/" + productPageNumber + "/public/values?alt=json";
  // console.log("loadProductPage() urlEndpoint = " + urlString);
  var numberOfProducts = 0;

	$.getJSON(urlString, function(json) {
   
    var entry = json.feed.entry;

    // Load Title
    $(document).prop('title', json.feed.title.$t);
    $("#product_category_value").text(json.feed.title.$t);

    // Load Product Information
		$(entry).each(function(){

      // second row onwards, SKU
      if(this.gs$cell.row == productItemNumber) {
        switch (this.gs$cell.col) {
          case "1": // SKU
            // means, finished parsing previous row
            break;
          case "2": // Brand
            break;
          case "3": // Product Name
            $(document).prop('title', this.content.$t);
            $("#product_name_value").text(this.content.$t);
            break;
          case "4": // Product Description
            $("#product_text_value").append(this.content.$t + "<BR>");
            break;
          case "5": // Product Description 2
            $("#product_text_value").append(this.content.$t + "<BR>"); 
            break;
          case "6":  // Product Price
            $("#productPriceValue").text(this.content.$t); 
            break;
          case "7":  // Discounted Price
            $("#productPriceValue").text(this.content.$t); 
            break;
          case "8":  // Discount Flag
            discountedFlagValue = this.content.$t;
            break;
          case "9":  // New Item Flag
            newFlagValue = this.content.$t;
            break;
          case "10":   // Image 1 Link
            var image_value = '<li data-image="' + this.content.$t + '"><img src="' + this.content.$t + '" alt=""></li>';
            $("#image_list_content").append(image_value);
            var selected_image_value = '<div class="image_selected"><img src="' + this.content.$t + '" alt=""></div>';
            $("#image_selected_item").append(selected_image_value);
            break;
          case "11":   // Image 2 Link
            var image_value = '<li data-image="' + this.content.$t + '"><img src="' + this.content.$t + '" alt=""></li>';
            $("#image_list_content").append(image_value);
            break;
          case "12":   // Image 3 Link
            var image_value = '<li data-image="' + this.content.$t + '"><img src="' + this.content.$t + '" alt=""></li>';
            $("#image_list_content").append(image_value);
            break;
          default:
            break;
        }
      }

    });

    // update the number of products here
    $("#shop_product_count_value").text(numberOfProducts.toString());
  
  });
}

function orderItemWhatsapp() {

  var url = "https://wa.me/60199913690?text=I'd%20like%20to%20order%20" + $("#quantity_input").val() + "%20unit%20of%20";
  var description = "I'd like to order " + $("#quantity_input").val() + " unit of " + $("#product_name_value").text() 
    + " [" + $("#product_text_value").text() + "] @ " + $("#productPriceValue").text() + "each";
  var desc2 = description.replace("Brand = ","Brand:");
  var desc3 = desc2.replace("Part Number = ","][P/N:");

  var desc4 = encodeURIComponent(desc3.trim())
  console.log ("test = " + desc3);
  var win = window.open(url+desc4, '_blank');
  win.focus();
}

