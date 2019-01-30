module.exports.spec_runner = function(application, req, res){
    if(process.env.NODE_ENV==='development'){
        res.render('unit_test/spec_runner', {});
    } else {
      res.render('index',{target:"home",validation:{msg:"É preciso logar e estar em ambiente de desenvolvimento para acessar a página!"},message:{}});
    }

}
