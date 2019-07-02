$(document).ready(function() {
    $.getJSON("js/products.json", function (data) {

        var urlSearchParams = new URLSearchParams(window.location.search);
        if (urlSearchParams.has("id")) {
            var product = urlSearchParams.get("id");
            if (data.products[product] == null) {
                console.log("product not found");
            } else if (!(data.products[product] == null)) {
                let prod = data.products[product],
                    pricing = prod.price.toFixed(2).toString().replace('.', ','),
                    specialPricing = prod.special_price ? prod.special_price.toFixed(2).toString().replace('.', ',') : null,
                    metaTitle = prod.meta_title,
                    name = prod.name.toLowerCase(),
                    sku = prod.sku,
                    type = prod.type,
                    brand = prod.brand,
                    description = prod.description,
                    qty = prod.qty,
                    status = prod.status;

                $('[data-name="page-title"]').text(metaTitle);
                $('[data-name="product-name"]').text(name);
                $('[data-name="product-sku"]').text(sku);
                $('[data-name="product-type"]').text(type);
                $('[data-name="product-brand"]').text(brand);
                $('[data-name="product-desc"]').append(description);
                $('[data-name="product-price"]').text(pricing);
                $('[data-name="product-qty"]').text(qty);
                $('[data-name="product-status"]').text(status);
                $('[data-name="product-button"]').attr('id', product);

                if (prod.status === "Op voorraad") {
                    $('[data-name="product-status"]').addClass('onstock');
                }
                if (prod.status !== "Op voorraad") {
                    $('[data-name="product-status"]').addClass('outofstock');
                }
                if (prod.special_price) {
                    $('[data-name="product-special"]').text(specialPricing);
                    $('[data-name="product-price"]').addClass('price-reduction');
                    $('[data-name="product-special"]').parent().removeClass('hide');
                }

                for (var i = 0; i < prod.images.length; i++)  {
                    $('[data-name="product-images"]').append('<li><img src="' + prod.images[i].image + '" alt="' + prod.meta_description + '"></li>');
                }

                if (prod.related) {
                    $('.related-prod-container').removeClass('hide');

                    for (var i = 0; i < prod.related.length && i < 4; i++) {
                        const relProdID = prod.related[i],
                              relProd = data.products[relProdID],
                                relProdDetails = {
                                    prodName: relProd.name.toLowerCase(),
                                    urlLink:'/?id=' + relProdID,
                                    imgLink:relProd.images[0].image
                                },
                              productCard = `   <div class="related-product-card shadow">
                                                <h4 class="typ-h4 color-dark-grey m-top-no m-bottom-sm" data-name="related-name">${relProdDetails.prodName}</h4>
                                                <img data-name="related-prod-img" src="${relProdDetails.imgLink}" height="auto" width="100%";>
                                                <div class="button-wrapper">
                                                    <a class="button button--secondary  show-related m-vert-md" href="${relProdDetails.urlLink}"><span class="icon icon-tag"></span>Bekijk dit product</a>
                                                    <button class="button button--secondary add-to-basket add-to-basket--related" id="${relProdID}"><span class="icon icon-shopping-basket"></span>voeg direct toe</button>
                                                </div>
                                            </div> `;

                        $('[data-name="related-prod"]').append(productCard);
                    }
                }
            }
        }


        var basketCount = 0;

        const  emptyListItem = $('.empty-basket'),
            addedProduct =$('.added-product'),
            basketContainer =$('.basket-itemlist-container'),
            basketList = $('[data-name="basket-list"]'),
            itemsBasket = $('#itemsBasket'),
            emptyBasket = $('.button.clear-all'),
            checkOut = $('.button.submit'),
            basketToggle = $('.basket'),
            addToBasket = $('.add-to-basket');

        if (basketCount = 0) {
            emptyListItem.removeClass('hide');
        }



        addToBasket.click(function (){
            emptyListItem.addClass('hide');
            basketCount ++;
            emptyBasket.removeClass('inactive');
            checkOut.removeClass('inactive');
            const prodToBasketID = $(this).attr('id'),
                prodToBasket = data.products[prodToBasketID],


                prodBasketDetails = {
                    basketName: prodToBasket.name.length > 25 ? prodToBasket.name.toLowerCase().substr(0, 20) + '...' : prodToBasket.name.toLowerCase(),
                    basketPrice: prodToBasket.special_price ? prodToBasket.special_price.toFixed(2).toString().replace('.', ',') : prodToBasket.price.toFixed(2).toString().replace('.', ','),
                    imgUrl:prodToBasket.images[0].thumb
            };

            itemsBasket.html(basketCount);
            itemsBasket.removeClass('hide');

            const basketListItem = `<li class="added-product" data-name="${prodToBasketID}">
                                        <div class="prod-in-basket">${prodBasketDetails.basketName}</div>
                                        <div class="prodimg-in-basket"><img data-name="related-prod-img" src="${prodBasketDetails.imgUrl}" height="auto" width="100%";></div>
                                        <div class="prodprice-in-basket">${prodBasketDetails.basketPrice}</div>
                                        <div class="remove-from-basket background-dark-red b-right-rad-sm"><span class="icon icon-trash color-white"></span></div>
                                    </li>`;

            basketList.append(basketListItem);
           saveBasket();
        });

        emptyBasket.click(function () {
            const  addedProduct = $('.added-product');
            basketCount = 0;
            addedProduct.remove();
            itemsBasket.html('0');
            itemsBasket.addClass('hide');
            emptyBasket.addClass('inactive');
            checkOut.addClass('inactive');
            emptyListItem.removeClass('hide');
            basketContainer.removeClass('reveal');
            saveBasket();
        });

        basketContainer.on('click', '.remove-from-basket', function(){
            $(this).parent().remove();
            basketCount --;
            itemsBasket.html(basketCount);
            if (basketCount === 0) {
                itemsBasket.html('0');
                itemsBasket.addClass('hide');
                emptyBasket.addClass('inactive');
                checkOut.addClass('inactive');
                emptyListItem.removeClass('hide');
            }
            saveBasket();
        });

        basketToggle.click(function (){
            if (!(basketContainer.hasClass('reveal'))) {
                basketContainer.addClass('reveal');
            }
            else { basketContainer.removeClass('reveal');}
            saveBasket();
        });
        window.alert = function(msg){
            $('.purchase-msg').text(msg);
            $('.purchase-container').addClass('reveal');
        }


        $(function(){
            $('.button--purchase').click(function(){
                $('.purchase-container').removeClass('reveal');
            })

            checkOut.click(function(){
                alert("Helaas is het momenteel niet mogelijk om af te rekenen")
            });
        });
        $. fn. slider = function(){
                let slider = $('.product-slider'),
                    sliderContainer = slider.parent(),
                    containerWidth = sliderContainer.width(),
                    slide = slider.find('ul li'),
                    slideCount = slide.length,
                    slideWidth = slide.width(),
                    slideHeight = slide.height(),
                    sliderUlWidth = slideCount * slideWidth;


        $('.product-slider').css({width: slideWidth, maxWidth: containerWidth, height: slideHeight});
        if (slideCount <= 1) {
            $('.product-slider ul').css('width', sliderUlWidth);
            $('a.prev-slide, a.next-slide').hide();
        }
        else {
            $('.product-slider ul').css({width: sliderUlWidth, marginLeft: -slideWidth});
        }
        $('.product-slider ul li:last-child').prependTo('.product-slider ul');

        function moveLeft() {
            $('.product-slider ul').animate({
                left: +slideWidth
            }, 200, function () {
                $('.product-slider ul li:last-child').prependTo('.product-slider ul');
                $('.product-slider ul').css('left', '');
            });
        };

        function moveRight() {
            $('.product-slider ul').animate({
                left: -slideWidth
            }, 200, function () {
                $('.product-slider ul li:first-child').appendTo('.product-slider ul');
                $('.product-slider ul').css('left', '');
            });
        };

        $('a.prev-slide').click(function () {
            moveLeft();
        });

        $('a.next-slide').click(function () {
            moveRight();
        });
    };
        $. fn. slider();
        $(window).on('unload', function () {
            saveBasket();
        });
            loadBasket();

        function loadBasket() {
            basketList.html(sessionStorage.basket);
            itemsBasket.html(sessionStorage.basketCount);
            basketContainer.removeClass('reveal');
            itemsBasket.html(sessionStorage.basketCount);
            if (sessionStorage.basketCount > 0) {
                itemsBasket.removeClass('hide');
                emptyBasket.removeClass('inactive');
                checkOut.removeClass('inactive');
                //emptyListItem.addClass('hide');

            }
            if (sessionStorage.basketCount <= 0) {
                emptyListItem.removeClass('hide');
            }
        }
        function saveBasket() {
            sessionStorage.basket = basketList.html();
            sessionStorage.basketCount = itemsBasket.html();
        }
    });
});


