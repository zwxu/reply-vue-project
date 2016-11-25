module.exports = function () {
    document.body.addEventListener('click', function (e) {
        var target = e.target;
        var startActivity = function (e) {
            var url = target.href;
            var title = target.title || '';
            if (url) {
                if (target.getAttribute("goto") == 'auth') {
                    e.preventDefault();
                } else if (target.getAttribute("goto") == '_external') {
                    e.preventDefault();
                    location.href = url;
                } else {
                    if (url.match(/#!?\/$/)) {
                        try {
                            e.preventDefault();
                            MiFiJsInternal.gotoStartPage();
                            MiFiJsInternal.finishCurrentActivity();
                        } catch (e) {
                            location.href = url;
                        }
                    } else {
                        try {
                            e.preventDefault();
                            MiFiJsInternal.startActivity(url, title);
                        } catch (e) {
                            location.href = url;
                        }
                    }
                }

            }
        }
        if (target.tagName == 'A') {
            startActivity(e);
        } else {
            do {
                if (target.tagName != 'A') {
                    continue
                }
                startActivity(e);
            } while (target = target.parentNode);
        }
    });
};