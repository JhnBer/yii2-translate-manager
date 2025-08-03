/**
 * Created on : 2014.12.04., 16:58:40
 * Author     : Lajos Molnar <lajax.m@gmail.com>
 * since 1.2
 */

$(document).ready(function () {
    FrontendTranslation.init();
});

/**
 * Object facilitating front end translation
 */
var FrontendTranslation = {
    enabledTranslate: false,
    dialogURL: '/translatemanager/language/dialog',
    params: '',
    dialog: function ($language_item) {
        this.params = $language_item.data('params');
        $('#translate-manager-div').dialog({
            modal: true,
            title: lajax.t('Translation Language: {name}', {name: $language_item.data('language_id')}),
            minWidth: 500,
            minHeight: 200,
            buttons: [
                {
                    text: lajax.t('Save'),
                    click: $.proxy(
                        function () {
                            var $form = $('#transslate-manager-translation-form');
                            $.ajax({
                                type: $form.attr('method'),
                                url: $form.attr('action'),
                                data:$form.serialize(),
                                dataType: 'json',
                                success: $.proxy(function(errors) {
                                    if (errors.length === 0) {
                                        if (!$language_item.hasClass('translation-icon')) {
                                            $('span[data-hash=' + $language_item.data('hash') + ']').html(lajax.t($.trim($form.find('textarea').val()), this.params));
                                        }
                                        $('#translate-manager-div').dialog('close');
                                    } else {
                                        helpers.showErrorMessages(errors, '#languagetranslate-');
                                    }
                                },this)

                            });

                        }, this)
                },
                {
                    text: lajax.t('Close'),
                    click: function () {
                        $(this).dialog('close');
                    }
                }
            ],
            create: $.proxy(
                function (event) {
                    $(event.target).load(this.dialogURL, {
                        hash: $language_item.data('hash'),
                        category: $language_item.data('category'),
                        language_id: $language_item.data('language_id')
                    }, function () {
                        $('#languagetranslate-translation').focus();
                    });
                }, this),
            close: function () {
                $('#translate-manager-div').dialog('destroy').html('');
            }
        });
    },
    changeSourceLanguage: function () {
        var $form = $('#transslate-manager-change-source-form');
        $('#translate-manager-message').load($form.attr('action'), $form.serialize());
    },
    addClick: function() {
        $('span.language-item.translatable').click($.proxy(function (event) {
            if (this.enabledTranslate) {
                this.dialog($(event.currentTarget));
                event.stopPropagation();
                return false;
            }
        }, this));
    },
    handleIcons: function () {
        $('img[data-translatable-attr]').each(function () {
            var $img = $(this);

            $img.next('.translation-icon').remove();

            if (FrontendTranslation.enabledTranslate) {
                var $icon = $(
                    '<span class="translation-icon" style="display:block; position:relative; height:0; width:0;"' +
                    'data-hash="' + $img.data('translatable-hash') + '" ' +
                    'data-language_id="' + $img.data('translatable-lang') + '" ' +
                    'data-category="' + $img.data('translatable-category') + '" ' +
                    '>' +
                    '<span style="display:flex; justify-content: center; align-items: center; ' +
                    'height: 20px; width: 20px; cursor:pointer; position:absolute; ' +
                    'top:-5px; left:5px; ' +
                    'background: #fff; transform: translateY(-100%)" ' +
                    '>🌐</span>' +
                    '</span>'
                );

                $icon.click(function (event) {
                    FrontendTranslation.dialog($icon);
                    event.stopPropagation();
                    return false;
                });

                $img.after($icon);
            }
        });
    },
    toggleTranslate: function () {
        var elements = $('.language-item');
        elements.toggleClass('translatable');
        this.enabledTranslate = elements.hasClass('translatable');
        this.addClick();

        this.handleIcons();
    },
    init: function () {
        $('body').on('change', '#translate-manager-language-source', $.proxy(function () {
            this.changeSourceLanguage();
        },this));
        $('body').on('click', '#toggle-translate', $.proxy(function () {
            this.toggleTranslate();
        }, this));

        if (typeof($('#toggle-translate').data('url')) !== 'undefined') {
            this.dialogURL = $('#toggle-translate').data('url');
        }
    }
};