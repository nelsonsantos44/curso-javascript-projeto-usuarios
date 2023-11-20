class Utils {
    
        static dateFormat(date){

            let month = (date.getMonth()+1);
            let day = (date.getDate());         
            let year = date.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
        
           /*
            if (day < 10 || month < 10 || minutes < 10 ){
                day = '0'+ day;
                month = '0'+ month;
                minutes = '0'+minutes;
           }
           */

            if (day < 10){
                day = '0'+ day                
           }

            if (month < 10){
                 month = '0'+ month                
            }

            if (minutes < 10){
                minutes = '0'+minutes
            }

            return day +'/'+month+'/'+year +' '+hours+ ':'+minutes;

        }

}