#angular-multi-level-select
AngularJs directive provide multi level select ,for example province,city,area.


##mock sever:
+ nginx config:
```conf
server {
    listen          80;
    server_name     php-data.com;
    index           index.php;
    root            /Users/feizheng/github/angular-multi-level-select/test/php-mysql-jquery;
    location ~ \.php$ {
        fastcgi_split_path_info     ^(.+\.php)(/.+)$;
        fastcgi_pass                127.0.0.1:9000;
        fastcgi_index               index.php;
        fastcgi_param               SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include                     fastcgi_params;
    }
}
```
+ sudo php-fpm
