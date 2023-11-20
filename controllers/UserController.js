class UserController {

    constructor(formIdCreate,formIdUpdate,tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId)

        this.onSubmit();
        this.onEdit();
    }

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]")

            btn.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            console.log(values)

            let index = this.formUpdateEl.dataset.trIndex
                //acessando o número da linha    

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);
                //acessando a tr, a informação do dataset.user a informação do user

            let result = Object.assign({},userOld, values);
                //object.assign cria um objeto destino, retornando este objeto
            
        this.getPhoto(this.formUpdateEl).then(

            (content)=>{        

            if(!values.photo) {
                result._photo = userOld._photo;  //verifica como a foto veio
            }else{
                result._photo = content;
            }
            

            tr.dataset.user = JSON.stringify(result);
               
            tr.innerHTML =`
            
            <td> <img src="${result._photo}" alt="User Image" class="img-circle img-sm"> </td>
            <td>${result._name}</td>
            <td>${result._email}</td>
            <td>${(result._admin) ?'Sim' : 'Não'}</td>
            <td>${(Utils.dateFormat(result._register))}</td>
            <td>
              <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
              <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>        
        `;

            this.addEventsTr(tr);

            this.updateCount();

            this.formUpdateEl.reset();

            btn.disabled = false; //permite clicar no botão  
            
            this.showPanelCreate();


        },
        (e)=>{
            console.error(e);

            alert('coloque um arquivo');
        });

    });
        
    }

    onSubmit(){

        this.formEl.addEventListener("submit", event => {

            event.preventDefault();

            let values = this.getValues(this.formEl);
            
            let btn = this.formEl.querySelector("[type=submit]")

            btn.disabled = true;

            if (!values) return false;

            this.getPhoto(this.formEl).then((content)=>{
                
                values.photo = content;

                this.addLine(values);

                this.formEl.reset();

                btn.disabled = false;
            },
            (e)=>{
                console.error(e);

                alert('coloque um arquivo');
            });

        });

    }
    

    getPhoto(formEl){

        return new Promise((resolve,reject)=>{
            
        let fileReader = new FileReader();

        let elements = [...formEl.elements].filter(item=>{

            if (item.name === 'photo'){
                return item;
            }            
        });

       let file = elements[0].files[0];

        fileReader.onload = () => {

            resolve(fileReader.result)

        }

        fileReader.onerror = () =>{

            reject(e)

        }
        
        if (file){fileReader.readAsDataURL(file);
        } else {
            resolve('dist/img/usuario_sem_foto.png');
        }
        });

    }


    getValues(formEl){

        let user = {};
        let isValid = true;


        [...formEl.elements].forEach(function (field, index) {
        

        if (['name','email','password'].indexOf(field.name) > -1 && !field.value){

            console.dir(field.parentElement.classList.add("has-error"));
            isValid = false            
            
        }


        if (field.name == "gender") {
    
                if (field.checked) {
    
                    user[field.name] = field.value
                }
            } else if(field.name == "admin") {              

                user[field.name] = field.checked;
                
            } else {
    
                user[field.name] = field.value;
    
            }
    
            //console.log(field.id, field.name, field.value , field.checked , field.index)
    
        });
    

        if(!isValid){
            return false;            
        }

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
            );
            
    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e=>{

            if(confirm("Deseja Realmente Excluir ?")){

                tr.remove(); //remove um item de uma array
                this.updateCount();
                this.showPanelCreate();
            }


        });

        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            console.log(JSON.parse(tr.dataset.user));

            let json = JSON.parse(tr.dataset.user);
            //let form = document.querySelector("#form-user-update");

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex
                      

            for (let name in json){
                
                let field = this.formUpdateEl.querySelector("[name = " + name.replace("_","") + "]");
                
                console.log(name, field);
               
                if (field) {                  

                    switch (field.type){

                        case 'file':
                        continue;
                        break;
                        
                        
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;
                        
                        
                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                    }
                   
                 }            

            }      

            this.formUpdateEl.querySelector(".photo").src = json._photo;
            //classe se seleciona com hashtag
            this.showPanelUpdate();
            
        });
    }

    addLine(dataUser) {


        let tr = document.createElement('tr');
        
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML =`
            
                <td> <img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"> </td>
                <td>${dataUser.name}</td>
                <td>${dataUser.email}</td>
                <td>${(dataUser.admin) ?'Sim' : 'Não'}</td>
                <td>${(Utils.dateFormat(dataUser.register))}</td>
                <td>
                  <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                  <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
                </td>
            
            `;


        this.addEventsTr(tr);




/*
        tr.querySelector(".btn-edit").addEventListener("click", e=>{

            console.log(JSON.parse(tr.dataset.user));

            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");

            form.dataset.trIndex = tr.sectionRowIndex
                      

            for (let name in json){
                
                let field = form.querySelector("[name = " + name.replace("_","") + "]");
                
                console.log(name, field);
               
                if (field) {                  

                    switch (field.type){

                        case 'file':
                        continue;
                        break;
                        
                        
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;
                        
                        
                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                    }
                   
                 }            

            }      

            this.showPanelUpdate();
            
        });
        */

        this.tableEl.appendChild(tr);

        this.updateCount();
    }

    showPanelCreate(){
        document.querySelector("#box-user-update").style.display = 'none'
        document.querySelector("#box-user-create").style.display = 'block'
    }


    showPanelUpdate(){
        document.querySelector("#box-user-update").style.display = 'block'
        document.querySelector("#box-user-create").style.display = 'none'
    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        //console.dir(this.tableEl);

        [...this.tableEl.children].forEach(tr=>{
 
           numberUsers++;

           //console.log(JSON.parse(tr.dataset.user))

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) numberAdmin++;
        
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admins").innerHTML = numberAdmin;
    }
}

