<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Example
 *
 * This is an example of a few basic user interaction methods you could use
 * all done with a hardcoded array.
 *
 * @package		CodeIgniter
 * @subpackage	Rest Server
 * @category	Controller
 * @author		Phil Sturgeon
 * @link		http://philsturgeon.co.uk/code/
*/

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
require APPPATH.'/libraries/REST_Controller.php';

class Timezone extends REST_Controller {
	function isAuth(){
		$id = $this->session->userdata('id');
		return isset($id) && $id > 0;
	}

	function get_get(){
		// if(!$this->isAuth()){
		// 	$this->response(array('error' => 'no login'), 200);
		// }else{
			$id = $this->session->userdata('id');
			if (!is_numeric($id)) {
				$this->response(array('error' => 'invalid user id'), 403);
			}
			$query = $this->db->query("SELECT * FROM timezone WHERE user_id={$id}");
			$result = $query->result();
			$data = array();
			foreach($result as $item){
				// $data->title = $item.title;
				// $data->desc = $item.desc;
				// $data->id = $item.id;
				// $data->amount = $item.amount;
				// $item->comments = $this->getComments($item->id);
			}
			$this->response(array('data' => $result), 200);
		// }
	}

	function getComments($id){
		$query = $this->db->query("SELECT * from comment WHERE expenseid='{$id}' ");
		$result = $query->result();
		return $result;
	}

	// function update_post(){
	function update_put(){
		// if (!$this->isAuth()) {
		// 	$this->response(array('error' => 'no login'), 200);
		// } else {
			$id = $this->put('id');
			// $user_id = $this->session->userdata('id');
			$name = $this->put('name');
			$city = $this->put('city');
			$timezone = $this->put('timezone');
			$apikey = $this->put('apikey');


			if (empty($name) || empty($city) || empty($timezone) || empty($id) || empty($apikey) ||
				strlen($name) > 20 || strlen($city) > 20 || !preg_match('/^GMT[\+\-]1?\d$/', $timezone)){
				$this->response(array('status' => 'false', 'error' => 'invalid input'), 403);
			}

			$query = $this->db->query("SELECT * FROM `keys` WHERE `key`='{$apikey}'");
			if ($query->num_rows == 1) {
				$result = $query->result();
				// var_dump($result[0]);
				$user_id = $result[0];
				$user_id = $user_id->user_id;
			} else {
				$this->response(array('status' => 'false', 'error' => 'Wrong API key'), 403);
			}
			$data = array(
				'name' => $this->put('name'),
				'city' => $this->put('city'),
				'timezone' => $this->put('timezone')
			);

			$this->db->where('id', $id);
			$this->db->update('timezone', $data);

			$query = $this->db->query("SELECT * from timezone WHERE id = {$id} ");
			if($query->num_rows == 1){
				$query2 = $this->db->query("SELECT * from timezone WHERE id = {$id} AND user_id = {$user_id}");
				if ($query2->num_rows == 0) {
					$this->response(array('status' => 'no auth', 'error' => 'no auth'), 200);
				}
				$result = $query->result();
				$data = $result[0];
				$this->response(array('status' => 'success', 'data' => $data), 200);
			}else{
				$this->response(array('status' => 'not exists', 'error' => 'not exists'), 200);
			}
		// }
	}

	function add_post() {

		// if (!$this->isAuth()) {
		// 	$this->response(array('error' => 'no login'), 200);
		// } else {
			$name = $this->post('name');
			$city = $this->post('city');
			$timezone = $this->post('timezone');
			$apikey = $this->post('apikey');

			// echo substr($timezone, 0, 3);
			// if (empty($name) || empty($city) || empty($timezone)
			// 	|| strlen($name) > 20 || strlen($city) > 20 || substr($timezone, 0, 3) != 'GMT') {
			// 	header("HTTP/1.1 200 OK");
			// 	echo json_encode(array('status' => 'invalid parameters'));
			// 	return;
			// }

			if (empty($name) || empty($city) || empty($timezone) || empty($apikey) ||
				strlen($name) > 20 || strlen($city) > 20 || !preg_match('/^GMT[\+\-]1?\d$/', $timezone)){
				$this->response(array('status' => 'false', 'error' => 'invalid input'), 403);
			}

			$query = $this->db->query("SELECT * FROM `keys` WHERE `key`='{$apikey}'");
			if ($query->num_rows == 1) {
				$result = $query->result();
				// var_dump($result[0]);
				$user_id = $result[0];
				$user_id = $user_id->user_id;
			} else {
				$this->response(array('status' => 'false', 'error' => 'Wrong API key'), 403);
			}
			$data = array(
				'name' => $this->post('name'),
				'city' => $this->post('city'),
				'timezone' => $this->post('timezone'),
				// 'user_id' => $this->session->userdata('id')
				'user_id' => $user_id
			);

			$this->db->insert('timezone', $data);
			$id = $this->db->insert_id();
			$query = $this->db->query("SELECT * from timezone WHERE id={$id} ");
			if ($query->num_rows == 1) {
				$result = $query->result();
				$data = $result[0];
				$this->response(array('status' => 'success', 'data' => $data), 200);
			}

			$this->response(array('status' => 'fail'), 200);
		// }
	}

	function addComment_post(){
		if(!$this->isAuth()){
			$this->response(array('error' => 'no login'), 200);
		}else{
			$data = array(
				'expenseid' => $this->post('id'),
				'comment' => $this->post('comment'),
			);

			$this->db->insert('comment', $data);
			$id = $this->db->insert_id();
			$query = $this->db->query("SELECT * from comment WHERE id={$id} ");
			if($query->num_rows == 1){
				$result = $query->result();
				$data = $result[0];
				$this->response(array('status' => 'success', 'data' => $data), 200);
			}

			$this->response(array('status' => 'fail'), 200);
		}
	}

	// function delete_post(){
	function delete_post(){
		// if (!$this->isAuth()) {
		// 	$this->response(array('error' => 'no login'), 200);
		// } else {
			$id = $this->get('id');
			$apikey = $this->post('apikey');
// echo 'delete' . $apikey;
			$query = $this->db->query("SELECT * FROM `keys` WHERE `key`='{$apikey}'");
			if ($query->num_rows == 1) {
				$result = $query->result();
				// var_dump($result[0]);
				$user_id = $result[0];
				$user_id = $user_id->user_id;
			} else {
				$this->response(array('status' => 'false', 'error' => 'Wrong API key'), 403);
			}
			$query = $this->db->query("SELECT * from timezone WHERE id='{$id}' AND user_id='{$user_id}'");

			if ($query->num_rows === 0) {		//nothing to delete in the DB
				$this->response(array('status' => 'not exists'), 200);
				return;
			} else {
				$this->db->query("DELETE from timezone where id='{$id}' ");
				$this->response(array('status' => 'success'), 200);
			}
		// }
	}
}