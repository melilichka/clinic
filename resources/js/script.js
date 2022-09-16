var Vashstom = {
    isMobile: $(window).width() < 768,
    clientCurrent: false,
    captchaRes: false,
    events: function(){
        var self = this;

        $('[data-role="menu.close"]').on('click',function(){
            $('[data-role="menu.mobile"]').removeClass('open');
            return false;
        });

        $('[data-role="menu.open"]').on('click',function(){
            $.fancybox.open({
                src: '<div class="fancy-container">'+$('[data-role="leftmenu.box"]').html()+'</div>',
                type: 'html',
                opts: {
                    baseClass: 'fancy-menu'
                }
            });
            return false;
        });

        $('[data-role="call.phone"]').on('click',function () {
            $.fancybox.open({
                src: '<div class="fancy-container">'+$('[data-role="phones"]').html()+'</div>',
                type: 'html',
                opts: {
                    baseClass: 'fancy-phones'
                }
            });
            return false;
        });

        $('[data-role="call.form"]').on('click',function(){
            var _this = $(this);

            $.fancybox.open({
                src: '<div class="fancy-container">'+$('[data-role="' + _this.data('target') + '"]').html()+'</div>',
                type: 'html',
                opts: {
                    baseClass: 'fancy-form',
                    afterShow: function () {
                        self.formValidate($('.fancybox-inner form'));
                        pickmeup.defaults.locales['ru'] = {
                            days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                            daysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                            daysMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                            monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
                        };
                        pickmeup('.fancybox-inner [data-role="calendar.date"]', {
                            hide_on_select : true,
                            format: 'd.m.y',
                            locale: 'ru'
                        });
                        /*pickmeup('.fancybox-inner [data-role="calendar.time"]', {
                            hide_on_select : true,
                            format: 'H:m',
                            locale: 'ru'
                        });*/
                    },afterClose: function () {
                        pickmeup('[data-role="calendar.date"]').hide();
                    }

                }
            });
            return false;
        });

        $(document).on('click','[data-role="leftmenu"] > li.parent',function () {
            var _this = $(this);

           $('> ul',_this).slideToggle('slow',function () {
               _this.toggleClass('active');
           });
        });
    },
    formValidate: function (form) {
        $.validator.addMethod("select", function(value, element) {
            return value != -1;
        }, "Вы не выбрали специалиста");

        var self = this,
            rules = {
                'date': {
                    required: true
                },
                'time': {
                    required: true
                },
                'name': {
                    required: true
                },
                'phone': {
                    required: true
                },
                'doctor': {
                    select: true
                }
            },
            messages = {
                'date': {
                    required: 'Поле обязательно для заполнения'
                },
                'time': {
                    required: 'Поле обязательно для заполнения'
                },
                'name': {
                    required: 'Поле обязательно для заполнения'
                },
                'phone': {
                    required: 'Поле обязательно для заполнения'
                }
            };

        if(form.data('role') == 'form-vyzov') {
            rules['address'] = {required: true};
            messages['address'] = {required: 'Поле обязательно для заполнения'};
        }

        form.validate({
            rules: rules,
            messages: messages,
			submitHandler: function(){
				$.ajax({
					url: '/includes/send.php',
					data: form.serialize(),
					dataType: 'json',
					success: function(d){
						if(d.res == 'ok') {
							$.fancybox.close();
							$.fancybox.open('<div class="thanks">Ваша заявка отправлена</div>');
						} else {
							$.fancybox.close();
							$.fancybox.open('<div class="thanks">Произошла ошибка во время отправки запроса</div>');
						}
					},
					error: function(){
						$.fancybox.close();
						$.fancybox.open('<div class="thanks">Произошла ошибка во время отправки запроса</div>');
					}
				});
				
				return false;
			}
        });
    },
    initOwlCarousel: function(){
        var self = this;
        $('[data-role="owl.carousel"]').each(function(){
            var _this = $(this),
                parent = _this.closest('[data-role="owl.wrap"]'),
                params = _this.data('params'),
                data = new Object(),
                counter = $('[data-role="owl.counter"]',parent);

            data.items = 1;
            data.dots = true;
            data.nav = false;
            data.navText = ['',''];
            data.loop = true;
            data.dotsContainer = $('[data-role="owl.dots"]',parent);
            if(params) {
                for(var k in params) {
                    data[k] = params[k];
                }
            }

            if(params && params.onlyMobile) {
                if(self.isMobile) {
                    var carousel = _this.owlCarousel(data);
                }
            } else {
                var carousel = _this.owlCarousel(data);
            }
        });
    },
    init: function() {
        var self = this;

        self.initOwlCarousel();
        self.events();
    }
};

$(document).ready(function(){
    Vashstom.init();
});