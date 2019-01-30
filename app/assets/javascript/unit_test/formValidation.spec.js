describe('formValidation.js', function(){

  it('validate an email address', function(){

    const formValidation = new FormValidation();

    let emailValidationTrue1 = formValidation.validateEmail("carlos.cesar.ferraz@gmail.com");
    let emailValidationTrue2 = formValidation.validateEmail("carlos.cesar.ferraz@gmail.co");
    let emailValidationTrue3 = formValidation.validateEmail("carlos_cesar_ferraz@gmail.com");
    let emailValidationTrue4 = formValidation.validateEmail("carlos_cesar_ferraz@gmail.co");
    let emailValidationTrue5 = formValidation.validateEmail("carlos.cesar.ferraz@gmail.c");
    let emailValidationTrue6 = formValidation.validateEmail("carlos.cesar.ferraz@gmail.");
    let emailValidationTrue7 = formValidation.validateEmail("carlos.cesar.ferraz@gmail");
    let emailValidationTrue8 = formValidation.validateEmail("carlos.cesar.ferraz@");
    let emailValidationTrue9 = formValidation.validateEmail("@gmail.com");
    let emailValidationTrue10 = formValidation.validateEmail("@gmail.");

    expect(emailValidationTrue1).toBeTruthy();
    expect(emailValidationTrue2).toBeTruthy();
    expect(emailValidationTrue3).toBeTruthy();
    expect(emailValidationTrue4).toBeTruthy();
    expect(emailValidationTrue5).not.toBeTruthy();
    expect(emailValidationTrue6).not.toBeTruthy();
    expect(emailValidationTrue7).not.toBeTruthy();
    expect(emailValidationTrue8).not.toBeTruthy();
    expect(emailValidationTrue9).not.toBeTruthy();
    expect(emailValidationTrue10).not.toBeTruthy();

  });


});
