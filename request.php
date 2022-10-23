<?php
       
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
                   
    function get_data() {
        $current_data=file_get_contents("data.json");
        $data=json_decode($current_data, true);
                           
        $extra=array(
            'nom' => $_GET['nom-anime'],
        );
        $data->anime[]=$extra;
        echo "data exist";
        return json_encode($data);    
    }
      
    if(file_put_contents("data.json", get_data())) {
        echo 'success';
    }                
    else {
        echo 'There is some error';                
    }
}
       
?>