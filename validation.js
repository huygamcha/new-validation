
// B1: lấy được form-2  ||Validator
// B2: lấy được các input có name và rules ||inputs
// B3: Tạo ra một object để chứa key(name): value(rules) ||formRules
// B4: Tạo ra được các hàm kiểm tra đối với từng value(rules) ||validatorRules
// B5: Biết cách nhập vào value(rules) để xử dùng hàm kiểm tra || ruleFunc  = validatorRules[rule]
// B6: Phân chia tách rules từ input cách nhau với dấu | và : || rules, ruleInfo, isRulesHasValue
// B7: Sau khi xử lí phân tách xong thì quay về với bước B3, kết hợp với B4 thay value(rules) thành các
// hàm mà B4 đã tạo sẵn, lưu ý là sẽ tạo ra một mảng để chứa các value(rules) trong key(name)
// chú ý đến các trong min. max phải xử lí thêm
// B8: Lắng nghe sự kiện để validate (blur, change)
// 8.1 Lọc qua các rule của từng input để kiểm tra xem validatorRules có thoả mãn hay không rules
// 8.2 In ra màn hinh màu đỏ nếu như value truyền vào validatorRules bị sai errorMessage
// 8.3 Lấy được thẻ cha (form-group) của mỗi input || formGroup
// 8.4 Truy cập vào phần form-message để in ra màn hình dưới thẻ input  || alertMessageError
// B9: Hành động submit
// Xử lí đoạn object
// Xử lí true hoặc false
function Validator(formSelector) {
    // Lấy phần tử cha 
    function getParent(sonselector, parentselector) {
        while (sonselector.parentElement) {
            if (sonselector.parentElement.matches(parentselector)) {
                return sonselector.parentElement
            }
            sonselector = sonselector.parentElement
        }
    }

    var formRules = {
        // nguyện vọng là truyền 
        // fullname: 'required',
        // email: 'required|email'
    }

    // nguyện vọng lấy value từ key trên hàm formRules để kiểm tra xem value dó có hợp lệ hay không
    var validatorRules = {
        required: function (value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : 'Hãy nhập đúng email'
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui lòng nhập ít nhất ${min} kí tự`
            }
        },
        max: function (max) {
            return function (value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} kí tự`
            }
        }
    }

    var formElement = document.querySelector('#form-2')
    // kiểm tra nếu có formElement thì mới xử lí
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]')

        // Xử lí tất cả các rule trong từng input
        for (let input of inputs) {
            formRules[input.name] = input.getAttribute('rules')

            // với mỗi input.getAttribute('rules') thì ta phân tách ra nên sẽ là thành một mảng
            var rules = input.getAttribute('rules').split('|')
            // lọc qua từng phần tử sau khi split
            for (var rule of rules) {
                var ruleInfo
                var isRulesHasValue = rule.includes(':')
                // rule là mảng khi chia tách dấu :
                if (isRulesHasValue) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }
                // vì đối với phần min, ta không muốn function lồng trong function mà muốn gán giá trị cho func
                // đầu tiên để trả về function bên trong nên ta sẽ xử li riêng cho phần này

                var ruleFunc = validatorRules[rule]

                // nếu là rule có chứa : (min, max) thì bỏ value vào trong function đó
                if (isRulesHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1])
                }

                // Kiểm tra xem key[name] đã là mảng chưa, nếu chưa thì push tiếp rule vào
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                }
                // lần đầu tiên chắc chắn là chưa nên ta vừa tạo một mảng vừa push rule đầu tiên vào 
                else {
                    formRules[input.name] = [ruleFunc]
                }
            }
            input.onblur = handleValidate;
            input.oninput = handleClearMessage;
        }
        // Hàm thực hiện validate
        function handleValidate(event) {
            // lấy các rules từ bằng cách truy cập vào event.target.name
            var rules = formRules[event.target.name];
            // Hàm some sẽ kiểm tra từng rule xem có thoả mãn với validatorRules hay không
            var errorMessage
            // Bây giờ rule sẽ là các function trong validatorRules, với các function được chứa trong mỗi input
            rules.some(function (rule) {
                return errorMessage = rule(event.target.value)
            })
            if (errorMessage) {
                // Lấy được thẻ cha của mỗi input
                var formGroup = getParent(event.target, '.form-group')
                // Trỏ đến phần bên dưới của mỗi thẻ input để in ra lỗi
                var alertMessageError = formGroup.querySelector('.form-message')
                if (alertMessageError) {
                    formGroup.classList.add('invalid')
                    alertMessageError.innerText = errorMessage
                }
            }
            return !errorMessage
        }
        function handleClearMessage(event) {
            // Kiểm tra xem nếu như fom-group nào có invalid thì loại bỏ nó
            var formGroup = getParent(event.target, '.form-group')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')
            }
            // Truy cập vào phần in ra màn hình để xoá đi
            var alertMessageError = formGroup.querySelector('.form-message')
            if (alertMessageError) {
                alertMessageError.innerText = ''

            }
        }
    }
    // Viết theo kiểu ES6 nên là không cần quan tâm đến lỗi this(xem trong bài 204)
    formElement.onsubmit = (event) => {
        event.preventDefault()

        // Lọc qua lại tất cả inputs bên trong form
        var inputs = formElement.querySelectorAll('[name][rules]')
        isValid = true;
        for (let input of inputs) {
            // với như thế này thì event sẽ là {target:input}
            // trong dòng var rules = formRules[event.target.name];
            // thì event.target sẽ lấy được input
            if (!handleValidate({ target: input })
            ) {
                isValid = false;
            }
        }
        if (isValid) {
            // với this chính là lấy hàm Validator
            // sau đó sử dụng Validator với function và onSubmit
            if (typeof this.onSubmit === 'function') {
                // select tất cả các field là name
                var enableInput = formElement.querySelectorAll('[name]')
                // vì enableInput trả về nodelist nên phải chuyển sang Array để sử dụng reduce
                var listsubmit = Array.from(enableInput).reduce(function (values, input) {
                    // nhưng đoạn mã bên dưới sẽ không in ra gì hết(giải thích ở video 200) nếu như ta nhập thiếu một trường
                    // return (values[input.name] = input.value) && values
                    // nên ta sử dụng đoạn mã sau

                    // kiểm tra kiểu của từng loại, chứ không sẽ bug ở phần lấy value của phần radio
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'checkbox':
                            // kiêm tra xem nếu chưa được check(tức là cái sẽ ko lấy giá trị sẽ trả về values như thông thường)
                            if (!input.matches(':checked')) return values
                            // nếu input ở kiểu checked thì gán cho nó thành một mảng
                            if (!Array.isArray(values[input.name])) {
                                values[input.name] = []
                            }
                            // đoạn này sẽ cập nhật cái input đó vào mảng vừa tạo
                            values[input.name].push(input.value)
                            break;
                        case 'file':
                            values[input.name] = input.files
                            break;
                        default:
                            values[input.name] = input.value
                    }
                    return values
                    // với việc truyền object thì values sẽ nhận giá trị là object
                }, {})

                // gọi lại hàm onSubmit và trả về giá trị 
                this.onSubmit(listsubmit)
            }
            else {
                formElement.submit();
            }
        }
    }
}
