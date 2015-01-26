jQuery(document).ready(function(){
  (function($){
    function Key(params) {
      if (Object.prototype.toString.call(params) == "[object Arguments]") {
        this.keyboard = params[0];
      } else {
        this.keyboard = params;
      }

      this.$key = $("<li/>");
      this.current_value = null;
    }

    Key.prototype.render = function() {
      if (this.id) {
        this.$key.attr("id", this.id);
      }

      return this.$key;
    };

    Key.prototype.setCurrentValue = function(i) {
      var _this = this;
      if (this.keyboard.active_shift) {
        this.current_value = this.preferences.hasOwnProperty('u') ? this.preferences.u : this.default_value;
      } else {
        this.current_value = this.preferences.hasOwnProperty('d') ? this.preferences.d : this.default_value;
      }
      if ((i == 39) ||(i == 42)) {
        if (this.keyboard.options.layout == "symb"){
          this.$key.text(this.keyboard.layouts[_this.keyboard.options.currLang + "SymbName"]);
          return;
        }
      }      
      if (i == 41) {
        this.$key.text(this.keyboard.layouts[_this.keyboard.options.layout + "Name"]);
        return;
      }

      this.$key.text(this.current_value);
    };

    Key.prototype.setCurrentAction = function() {
      var _this = this;

      this.$key.unbind("click.mlkeyboard");
      this.$key.bind("click.mlkeyboard", function(){
        _this.keyboard.keep_focus = true;

        if (typeof(_this.preferences.onClick) === "function") {
          _this.preferences.onClick(_this);
        } else {
          _this.defaultClickAction();
        }
      });
    };

    Key.prototype.defaultClickAction = function() {
      this.keyboard.destroyModifications();

      if (this.is_modificator) {
        this.keyboard.deleteChar();
        this.keyboard.printChar(this.current_value);
      } else {
        this.keyboard.printChar(this.current_value);
        if (this.keyboard.active_shift) {
          this.keyboard.toggleShift();
          this.keyboard.setUpKeys();       
        }
      }

      if (this.preferences.m && Object.prototype.toString.call(this.preferences.m) === '[object Array]') {
        this.showModifications();
      }

    };

    Key.prototype.showModifications = function() {
      var _this = this;

      this.keyboard.modifications = [];

      $.each(this.preferences.m, function(i, modification) {
        var key = new Key(_this.keyboard);
        key.is_modificator = true;
        key.preferences = modification;
        _this.keyboard.modifications.push(key);
      });

      this.keyboard.showModifications(this);
    };

    Key.prototype.toggleActiveState = function() {
      if (this.isActive()) {
        this.$key.addClass('active');
      } else {
        this.$key.removeClass('active');
      }
    };

    Key.prototype.isActive = function() {
      return false;
    };
      function KeyDelete() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-backspace";
      this.default_value = 'delete';
    }

    KeyDelete.prototype = new Key();
    KeyDelete.prototype.constructor = KeyDelete;

    KeyDelete.prototype.defaultClickAction = function() {
      this.keyboard.deleteChar();
    };
      function KeySearch() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-search";
      this.default_value = 'Поиск';
    }

    KeySearch.prototype = new Key();
    KeySearch.prototype.constructor = KeySearch;

    KeySearch.prototype.defaultClickAction = function() {
      this.keyboard.search();
    };
      function KeyChangeSymbols() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-changeToSymbols";
      this.default_value = '.?123';
    }

    KeyChangeSymbols.prototype = new Key();
    KeyChangeSymbols.prototype.constructor = KeyChangeSymbols;
    KeyChangeSymbols.prototype.defaultClickAction = function() {
        if (this.keyboard.options.layout == "symb") {
          this.keyboard.options.layout = this.keyboard.options.currLang;
          this.keyboard.setUpKeys();
        } else {
          this.keyboard.options.layout = "symb";
          this.keyboard.setUpKeys();
        }
    };
      function KeyChangeLanguage() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-changeLanguage";
      this.default_value = 'lang';
    }

    KeyChangeLanguage.prototype = new Key();
    KeyChangeLanguage.prototype.constructor = KeyChangeLanguage;

    KeyChangeLanguage.prototype.defaultClickAction = function() {
      var currLang = this.keyboard.options.currLang;
      if (currLang == "ru") {
        this.keyboard.options.layout = "en";
        this.keyboard.setUpKeys();
      } else if (currLang == "en") {
        this.keyboard.options.layout = "ru";
        this.keyboard.setUpKeys();
      }
      this.keyboard.options.currLang = this.keyboard.options.layout;
    };
      function KeyClose() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-close";
      this.default_value = 'close';
    }

    KeyClose.prototype = new Key();
    KeyClose.prototype.constructor = KeyClose;

    KeyClose.prototype.defaultClickAction = function() {
      this.keyboard.close();
    };
      function KeyTab() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-tab";
      this.default_value = 'tab';
    }

    KeyTab.prototype = new Key();
    KeyTab.prototype.constructor = KeyTab;

    KeyTab.prototype.defaultClickAction = function() {
      // TODO: It's doesn't work if inputs has different parents
      this.keyboard.$current_input.next(":input").focus();
    };
      function KeyCapsLock() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-capslock";
      this.default_value = 'caps lock';
    }

    KeyCapsLock.prototype = new Key();
    KeyCapsLock.prototype.constructor = KeyCapsLock;

    KeyCapsLock.prototype.isActive = function() {
      return this.keyboard.active_caps;
    };

    KeyCapsLock.prototype.defaultClickAction = function() {
      this.keyboard.toggleCaps();
    };
      function KeyReturn() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-return";
      this.default_value = 'return';
    }

    KeyReturn.prototype = new Key();
    KeyReturn.prototype.constructor = KeyReturn;

    KeyReturn.prototype.defaultClickAction = function() {
      var e = $.Event("keypress", {
        which: 13,
        keyCode: 13
      });
      this.keyboard.$current_input.trigger(e);
    };
      function KeyShift() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-"+arguments[1]+"-shift";
      this.default_value = 'shift';
    }

    KeyShift.prototype = new Key();
    KeyShift.prototype.constructor = KeyShift;

    KeyShift.prototype.isActive = function() {
      return this.keyboard.active_shift;
    };

    KeyShift.prototype.defaultClickAction = function() {
      this.keyboard.toggleShift();
    };
      function KeySpace() {
      Key.call(this, arguments);

      this.id = "mlkeyboard-space";
      this.default_value = ' ';
    }

    KeySpace.prototype = new Key();
    KeySpace.prototype.constructor = KeySpace;
      var KEYS_COUNT = 42;

    function Keyboard(options){
      this.defaults = {
        layout: 'ru',
        active_shift: false,
        active_symb: false,
        active_caps: false,
        is_hidden: true,
        enabled: true
      };

      this.options = $.extend({}, this.defaults);
      $.extend(this.options, options);
      this.options.currLang = this.options.layout;
      this.keys = [];
      this.$keyboard = $("<div/>").attr("id", "mlkeyboard");
      this.$modifications_holder = $("<ul/>").addClass('mlkeyboard-modifications');
      this.$current_input = $("input[type='text']").first();
    }

    Keyboard.prototype.layouts ={
      en : [
        {},//backspace
        {d: ']',u: '}'},
        {d: '[',u: '{'},
        {d: 'p',u: 'P'},
        {d: 'o',u: 'O'},
        {d: 'i',u: 'I'},
        {d: 'u',u: 'U'},
        {d: 'y',u: 'Y'},
        {d: 't',u: 'T'},
        {d: 'r',u: 'R'},
        {d: 'e',u: 'E'},
        {d: 'w',u: 'W'},
        {d: 'q',u: 'Q'},
        {},//search
        {d: '\'',u: '\"'},
        {d: ';',u: ':'},
        {d: 'l',u: 'L'},
        {d: 'k',u: 'K'},
        {d: 'j',u: 'J'},
        {d: 'h',u: 'H'},
        {d: 'g',u: 'G'},
        {d: 'f',u: 'F'},
        {d: 'd',u: 'D'},
        {d: 's',u: 'S'},
        {d: 'a',u: 'A'},
        {},//rshift
        {d: '&',u: '*'},
        {d: '/',u: '?'},
        {d: '.',u: '>'},
        {d: ',',u: '<'},
        {d: 'm',u: 'M'},
        {d: 'n',u: 'N'},
        {d: 'b',u: 'B'},
        {d: 'v',u: 'V'},
        {d: 'c',u: 'C'},
        {d: 'x',u: 'X'},
        {d: 'z',u: 'Z'},
        {},//lshift
        {}, // close
        {}, // Change to symbols
        {}, // Space
        {}, // Change language
        {} // Change to symbols
      ],
      ru : [
        {},//backspace
        {d: 'ё',u: 'Ё'},
        {d: 'х',u: 'Х'},
        {d: 'з',u: 'З'},
        {d: 'щ',u: 'Щ'},
        {d: 'ш',u: 'Ш'},
        {d: 'г',u: 'Г'},
        {d: 'н',u: 'Н'},
        {d: 'е',u: 'Е'},
        {d: 'к',u: 'К'},
        {d: 'у',u: 'У'},
        {d: 'ц',u: 'Ц'},
        {d: 'й',u: 'Й'},
        {},//search
        {d: 'э',u: 'Э'},
        {d: 'ж',u: 'Ж'},
        {d: 'д',u: 'Д'},
        {d: 'л',u: 'Л'},
        {d: 'о',u: 'О'},
        {d: 'р',u: 'Р'},
        {d: 'п',u: 'П'},
        {d: 'а',u: 'А'},
        {d: 'в',u: 'В'},
        {d: 'ы',u: 'Ы'},
        {d: 'ф',u: 'Ф'},
        {},//rshift
        {d: '.',u: ','},
        {d: 'ъ',u: 'Ъ'},
        {d: 'ю',u: 'Ю'},
        {d: 'б',u: 'Б'},
        {d: 'ь',u: 'Ь'},
        {d: 'т',u: 'Т'},
        {d: 'и',u: 'И'},
        {d: 'м',u: 'М'},
        {d: 'с',u: 'С'},
        {d: 'ч',u: 'Ч'},
        {d: 'я',u: 'Я'},
        {},//lshift
        {}, // close
        {}, // Change to symbols
        {}, // Space
        {}, // Change language
        {} // Change to symbols
      ],
      symb : [
        {},//backspace
        {d: '-',u: '-'},
        {d: '0',u: '0'},
        {d: '9',u: '9'},
        {d: '8',u: '8'},
        {d: '7',u: '7'},
        {d: '6',u: '6'},
        {d: '5',u: '5'},
        {d: '4',u: '4'},
        {d: '3',u: '3'},
        {d: '2',u: '2'},
        {d: '1',u: '1'},
        {d: '`',u: '~'},
        {},//search
        {d: ';',u: ':'},
        {d: '\'',u: '\"'},
        {d: ')',u: ')'},
        {d: '(',u: '('},
        {d: '*',u: '*'},
        {d: '&',u: '&'},
        {d: '%',u: '%'},
        {d: '$',u: '$'},
        {d: '#',u: '#'},
        {d: '@',u: '@'},
        {d: '!',u: '!'},
        {},//rshift
        {d: '?',u: '?'},
        {d: '.',u: '.'},
        {d: ',',u: ','},
        {d: ']',u: ']'},
        {d: '[',u: '['},
        {d: '>',u: '>'},
        {d: '<',u: '<'},
        {d: '/',u: '/'},
        {d: '=',u: '='},
        {d: '+',u: '+'},
        {d: '_',u: '_'},
        {},//lshift
        {}, // close
        {}, // Change to symbols
        {}, // Space
        {}, // Change language
        {} // Change to symbols
      ],
      enName : "Eng",
      ruName : "Рус",
      enSymbName : "ABC",
      ruSymbName : "АБВ",     
    };

    Keyboard.prototype.init = function() {
      this.$keyboard.append(this.renderKeys());
      this.$keyboard.append(this.$modifications_holder);
      $("body").append(this.$keyboard);
      this.active_shift = this.options.active_shift;
      this.active_caps = this.options.active_caps;
      this.active_symb = this.options.active_symb;
      this.setUpKeys();
    };

    Keyboard.prototype.setUpKeys = function() {
      var _this = this;
      $.each(this.keys, function(i, key){
        key.preferences = _this.layouts[_this.options.layout][i];

        key.setCurrentValue(i);
        key.setCurrentAction();
        key.toggleActiveState();
      });
    };

    Keyboard.prototype.renderKeys = function() {
      var $keys_holder = $("<ul/>");

      for (var i = 0; i<= KEYS_COUNT; i++) {
        var key;

        switch(i) {
        case 0:
          key = new KeyDelete(this);
          break;
        case 13:
          key = new KeySearch(this);
          break;
        case 37:
          key = new KeyShift(this, "left");
          break;
        case 25:
          key = new KeyShift(this, "right");
          break;
        case 42:
          key = new KeyChangeSymbols(this);
          break;
        case 41:
          key = new KeyChangeLanguage(this);
          break;
        case 40:
          key = new KeySpace(this);
          break;
        case 39:
          key = new KeyChangeSymbols(this);
          break;
        case 38:
          key = new KeyClose(this);
          break;  
        default:
          key = new Key(this);
          break;
        }

        this.keys.push(key);
        $keys_holder.append(key.render());
      }

      return $keys_holder;
    };

    Keyboard.prototype.setUpFor = function(obj) {
      var _this = this,
      $thisKeyboardButton;

      obj.after("<a href=\"#\" class=\"ml-keyboard-button\"></a>");
      $thisKeyboardButton = obj.siblings(".ml-keyboard-button");
      $thisKeyboardButton.on('click', function(){
        var $mlInput = obj,
        $prevInp = _this.$current_input;
        // If here is no any input in focus or focus was changed to different input
        // then keyboard should be set-upped and showed
        /*var input_changed = !_this.$current_input || $mlInput[0] !== _this.$current_input[0];

        if (!_this.keep_focus || input_changed) {
          if (input_changed) _this.keep_focus = true;*/

        _this.$current_input = $mlInput;

        function setCaretPosition(ctrl, pos){
            if(ctrl.setSelectionRange){
              window.setTimeout(function () {
                ctrl.focus();
                ctrl.setSelectionRange(pos,pos);
              }, 0);

            } else if (ctrl.createTextRange) {
              var range = ctrl.createTextRange();
              range.collapse(true);
              range.moveEnd('character', pos);
              range.moveStart('character', pos);
              range.select();
            } else {
              ctrl.value = "ctrl.value";
            }
          }
          _this.$current_input.on("focus", function(){
            setCaretPosition(this, this.value.length);
          });


        _this.$current_input.focus();

        if (!_this.options.enabled) {
          _this.options.enabled;
          return;
        }

        if (_this.$current_input.val() !== '') {
          _this.options.active_shift = false;
        }

        if (_this.options.is_hidden) {
          _this.$keyboard.addClass("ml-show");
          _this.options.is_hidden = false;
        } else if ($prevInp == $mlInput){
          _this.$keyboard.removeClass("ml-show");
          _this.options.is_hidden = true;
        }

        return false;
      });

      /*obj.bind('blur', function(){
        var VERIFY_STATE_DELAY = 500;

        // Input focus changes each time when user click on keyboard key
        // To prevent momentary keyboard collapse input state verifies with timers help
        // Any key click action set current inputs keep_focus variable to true
        clearTimeout(_this.blur_timeout);

        _this.blur_timeout = setTimeout(function(){
          if (!_this.keep_focus) {
            if (_this.options.is_hidden) {
              _this.$keyboard.removeClass("ml-show");
            }
          } else {
            _this.keep_focus = false;
          }
        }, VERIFY_STATE_DELAY);

      });*/

      
    };

    Keyboard.prototype.inputLocalOptions = function() {
      var options = {};
      for (var key in this.defaults) {
        var input_option = this.$current_input.attr("data-mlkeyboard-"+key);
        if (input_option == "false") {
          input_option = false;
        } else if (input_option == "true") {
          input_option = true;
        }
        if (typeof input_option !== 'undefined') { options[key] = input_option; }
      }

      return options;
    };

    Keyboard.prototype.printChar = function(char) {
      var current_val = this.$current_input.val();
      this.$current_input.val(current_val + char);
      this.$current_input.focus().trigger("input");
    };

    Keyboard.prototype.deleteChar = function() {
      var current_val = this.$current_input.val();
      this.$current_input.val(current_val.slice(0,-1));
      this.$current_input.focus().trigger("input");
    };

    Keyboard.prototype.search = function() {
      this.$current_input.closest('form').submit();
    };
    Keyboard.prototype.close = function() {
      this.$keyboard.removeClass("ml-show");
      this.options.is_hidden = true;
    };
    Keyboard.prototype.showModifications = function(caller) {
      var _this = this,
          holder_padding = parseInt(_this.$modifications_holder.css('padding'), 10),
          top, left, width;

      $.each(this.modifications, function(i, key){
        _this.$modifications_holder.append(key.render());

        key.setCurrentValue();
        key.setCurrentAction();
      });

      // TODO: Remove magic numbers
      width = (caller.$key.width() * _this.modifications.length) + (_this.modifications.length * 6);
      top = caller.$key.position().top - holder_padding;
      left = caller.$key.position().left - _this.modifications.length * caller.$key.width()/2;

      this.$modifications_holder.one('mouseleave', function(){
        _this.destroyModifications();
      });

      this.$modifications_holder.css({
        width: width,
        top: top,
        left: left
      }).show();
    };

    Keyboard.prototype.destroyModifications = function() {
      this.$modifications_holder.empty().hide();
    };

    Keyboard.prototype.toggleShift = function(state) {
      this.active_shift = !this.active_shift;
      this.changeKeysState();
    };

    Keyboard.prototype.toggleCaps = function(state) {
      this.active_caps = state ? state : !this.active_caps;
      this.changeKeysState();
    };

    Keyboard.prototype.changeKeysState = function() {
      $.each(this.keys, function(i, key){
        key.setCurrentValue(i);
        key.toggleActiveState();
      });
    };

    $.fn.mlKeyboard = function(options) {
      var keyboard = new Keyboard(options);
      keyboard.init();

      this.each(function(){
        keyboard.setUpFor($(this).children('input:first'));
      });
    };
  })(jQuery);
});