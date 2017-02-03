(function() {
  'use strict';

  angular.module('cameraApp', [])
    .filter('cartTotal', function() {
      return function(cart) {
        return cart.reduce((acc, item) => {
          return acc += item.price * item.quantity;
        }, 0);
      }
    })
    .component('cameras', {
      template: `
        <cart cart="$ctrl.cart" ng-show="$ctrl.cart.length > 0"></cart>
        <div class="container">
          <h2 class="red-text">cameras</h2>
          <camera-search search="$ctrl.search"></camera-search>
          <camera-results search="$ctrl.search" cart=$ctrl.cart></camera-results>
        </div>
      `,
      controller: function() {
        const vm = this;

        vm.$onInit = function() {
          vm.search = { order: 'name', input: '' };
          vm.cart = [];
        };
      }
    })

    .component('cart', {
      bindings: {
        cart: "="
      },
      controller: function() {
        const vm = this;

        vm.toggleCart = function() {
          vm.cartIsOpen = !vm.cartIsOpen;
        }

        vm.removeFromCart = function(item) {
          console.log(item);
          vm.cart.splice(vm.cart.indexOf(item), 1)
        }

        vm.$onInit = function() {
          vm.cartIsOpen = false;
        }
      },
      template: `
        <div class="cart-blur" ng-show="$ctrl.cartIsOpen" ng-click="$ctrl.toggleCart()"></div>
        <ul class="cart white">
          <li>
            <div class="container" ng-show="$ctrl.cartIsOpen">
              <h2 class="red-text">cart</h2>
              <table class="highlight">
                <thead>
                  <tr>
                    <th class="hide-on-small-only">Camera</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr ng-repeat="item in $ctrl.cart">
                    <td class="hide-on-small-only camera-icon"><img ng-src="{{ item.image }}"></td>
                    <td>{{ item.name }}</td>
                    <td>$ {{ item.price | number:2 }}  <strong class="red-text" ng-if="item.onSale==true">SALE</strong></td>
                    <td>{{ item.quantity }}</td>
                    <td>$ {{ item.quantity * item.price  | number:2}}</td>
                    <td ng-click="$ctrl.removeFromCart(item)"><i class="material-icons">delete</i></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td class="hide-on-small-only"></td>
                    <td></td>
                    <td></td>
                    <td>Subotal:</td>
                    <td>$ {{ $ctrl.cart | cartTotal | number:2 }}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="hide-on-small-only"></td>
                    <td></td>
                    <td></td>
                    <td>Tax:</td>
                    <td>$ {{ ($ctrl.cart | cartTotal) * 0.096 | number:2 }}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td class="hide-on-small-only"></td>
                    <td></td>
                    <td></td>
                    <td>Total:</td>
                    <td>$ {{ ($ctrl.cart | cartTotal) * 1.096 | number:2 }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
              <button class="btn red checkout">Checkout</button>
            </div>
            <div ng-click="$ctrl.toggleCart()" class="cart-header red"><h4>cart: \${{ $ctrl.cart | cartTotal | number:2}} + tax</h4></div>
          </li>
        </ul>
      `
    })
    .component('cameraSearch', {
      bindings: {
        search: "="
      },
      controller: function() {
        const vm = this;

        vm.initSelect = function(){
          $('select').material_select();
        }
      },
      template: `
        <div class="row">
          <div class="col s8 input-field">
            <input ng-model="$ctrl.search.input" type="text" placeholder="Search">
          </div>
          <div class="col s4 input-field">
            <select ng-model="$ctrl.search.order" ng-init="$ctrl.initSelect()">
              <option selected value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </div>
        </div>
      `
    })
    .component('cameraResults', {
      bindings: {
        search: "<",
        cart: "="
      },
      controller: function() {
        const vm = this;

        vm.intToAsterisk = function(num, acc = '') {
          if (!num) { return acc };

          return vm.intToAsterisk(num -= 1, acc += '★');
        }

        vm.addToCart = function(camera) {
          if (vm.cart.indexOf(camera) > -1) {
            return vm.cart[vm.cart.indexOf(camera)].quantity += 1;
          }
          camera.quantity = 1;
          vm.cart.push(camera);
        }

        vm.$onInit = function() {
          vm.cameras = [
            {
              id: 1,
              name: 'Nikon D3100 DSLR',
              image: 'http://ecx.images-amazon.com/images/I/713u2gDQqML._SX522_.jpg',
              rating: 4,
              price: 369.99,
              onSale: true
            },
            {
              id: 2,
              name: 'Canon EOS 70D',
              image: 'http://ecx.images-amazon.com/images/I/81U00AkAUWL._SX522_.jpg',
              rating: 2,
              price: 1099.0,
              onSale: false
            },
            {
              id: 3,
              name: 'Nikon D810A',
              image:'http://ecx.images-amazon.com/images/I/91wtXIfLl2L._SX522_.jpg',
              rating: 3,
              price: 3796.95,
              onSale: true
            },
            {
              id: 4,
              name: 'Sony LCSEBE/B',
              image:'https://images-na.ssl-images-amazon.com/images/I/71eN3qZeiNL._SL1200_.jpg',
              rating: 1,
              price: 44.95,
              onSale: false
            }
          ];
        }
      },
      template: `
        <div class="row">
          <div class="col s12 m6 l4 product" ng-repeat="camera in $ctrl.cameras | orderBy: $ctrl.search.order | filter: $ctrl.search.input">
            <h3>{{ camera.name }}</h3>
            <div class="product-image" style="background-image: url({{ camera.image }})"></div>
            <h5>\${{ camera.price | number:2 }} <span class="red-text" ng-if="camera.onSale==true">SALE</span></h5>
            <h5>{{ $ctrl.intToAsterisk(camera.rating) }}</h5>
            <button ng-click="$ctrl.addToCart(camera)" class="btn red add">+</button>
          </div>
        </div>
      `
    });
})();
