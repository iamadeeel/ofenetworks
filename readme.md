## API ENDPOINTS

The URL will remain the same in the development enviroment
<br>
`Base URL: http://blueb0x.herokuapp.com`

**API Endpoints:** <br>
API AUTH <br>
baseURL+`/api/auth`..........

`GET: /` Gives you a simple JSON with a message <br>
`GET: /signout` Gives you a simple JSON with a message <br>

`POST: /register` Takes the user details and returns message <br>
email `username`<br>
address `address`<br>
date of birth `dob`<br>
phone `phone`<br>
phone-alt `alt_phone`<br>
image of id `id_image`<br>
id type `id_type`<br>
name on id `legal_name`<br>
number of id `id_number`<br>
gender of man `sex`<br>
id issue date `issue_date_id`<br>
id expiry date `expiry_date_id`<br>

`POST: /login`returns AUTH token in a message. <br>
email `username`<br>
password `password`<br><br>
`---------------`
<br><br>

API IO <br>
baseURL+`/api/io`..........<br>
`POST: /order/post-new` takes order type and link<br>
type of order b4m / s4m`order_type`<br>
links of products accepts string URL for array index `links[index]`<br>
