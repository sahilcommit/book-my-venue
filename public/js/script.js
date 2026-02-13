// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  
// Password Visibility Toggle Logic
const toggleBtn = document.getElementById('togglePassword');

if (toggleBtn) {
    toggleBtn.addEventListener('change', function() {
        const isChecked = this.checked;
        
        // Select any input field containing "password" in the name attribute
        const passwordFields = document.querySelectorAll('input[name*="assword"]');
        
        passwordFields.forEach(field => {
            field.type = isChecked ? 'text' : 'password';
        });
    });
}