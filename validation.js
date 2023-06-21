
// B1: lấy được form-2  ||Validator
// B2: lấy được các input có name và rules ||inputs
// B3: Tạo ra một object để chứa key(name): value(rules) ||formRules
// B4: Tạo ra được các hàm kiểm tra đối với từng value(rules) ||validatorRules
// B5: Biết cách nhập vào value(rules) để xử dùng hàm kiểm tra || ruleFunc  = validatorRules[rule]
// B6: Phân chia tách rules từ input cách nhau với dấu | và : || rules, ruleInfo, isRulesHasValue
// B7: Sau khi xử lí phân tách xong thì quay về với bước B3, kết hợp với B4 thay value(rules) thành các
// hàm mà B4 đã tạo sẵn, lưu ý là sẽ tạo ra một mảng để chứa các value(rules) trong key(name)
// chú ý đến các trong min. max phải xử lí thêm
function Validator(formSelector) {
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
            return regex.test(value) ? undefined : 'Vui lòng nhập trường này'
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

        // 
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
        }

    }
    console.log('formRules', formRules);
}
