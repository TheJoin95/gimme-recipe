<?php

require_once(dirname(__FILE__) . '/../utils/Spyc.php');
$config = Spyc::YAMLLoad(dirname(__FILE__) . '/config.yaml');

print_r($config);

?>