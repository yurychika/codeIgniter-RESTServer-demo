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

class User extends CI_Controller {

	function index() {
		var_dump($_POST);
		echo $this->input->post('username');
	}

	function test_get(){
		$id = $this->session->userdata('id');
		$id = $this->session->userdata('apikey');
		var_dump($id);
		echo $id == false;
		// echo 'Total Results: ' . $query->num_rows();
	}

	function get_get(){
		echo 123;
	}

	function login() {
		// $rawpostdata = file_get_contents("php://input");
		// $post = json_decode($rawpostdata, true);
		// $username = $post['username'];
		// $password = $post['password'];
		if (!isset($_POST['username']) || !isset($_POST['password'])) {
			header("HTTP/1.1 200 OK");
			echo json_encode(array('status' => 'invalid parameters'));
			return;
		}
		$username = $_POST['username'];
		$password = $_POST['password'];
		if (empty($username) || empty($password) || !preg_match('/^[a-zA-Z0-9_]*$/', $username)) {
			header("HTTP/1.1 200 OK");
			echo json_encode(array('status' => 'fail', 'error' => 'invalid input'));
			return;
		}


		$username = addslashes($username);
		$password = addslashes($password);
		$password = md5($password);

		$query = $this->db->query("SELECT id, username, password FROM user WHERE username='{$username}' and password='{$password}' ");
		if($query->num_rows > 0){
			$result = $query->result();
			$id = $result[0]->id;
			$username = $result[0]->username;
			
 			$this->session->set_userdata('id', $id);
			$this->session->set_userdata('username', $username);
			$apikey = md5($id . $username . time());
			$this->session->set_userdata('apikey', $apikey);

			$data = array(
				'key' => $apikey,
				'user_id' => $id
			);

			$this->db->insert('keys', $data);

			header("HTTP/1.1 200 OK");
			echo json_encode(array('status' => 'successs', 'apikey' => $apikey));
			// $this->response(array('status' => 'successs'), 200);
		}else{
			header("HTTP/1.1 200 OK");
			echo json_encode(array('status' => 'fail'));
			// $this->response(array('status' => 'fail'), 200);
		}
		// echo 'Total Results: ' . $query->num_rows();
	}

	function signup(){
		// $rawpostdata = file_get_contents("php://input");
		// $post = json_decode($rawpostdata, true);
		// $username = $post['username'];
		// $password = $post['password'];
		if (!isset($_POST['username']) || !isset($_POST['password'])) {
			header("HTTP/1.1 200 OK");
			echo json_encode(array('status' => 'invalid parameters'));
			return;
		}
		$username = $_POST['username'];
		$password = $_POST['password'];
		if (empty($username) || empty($password) || strlen($username) > 20 || strlen($password) > 20 || 
			!preg_match('/^[a-zA-Z0-9_]*$/', $username)) {
			header("HTTP/1.1 200 OK");
			echo json_encode(array('status' => 'invalid parameters'));
			return;
		}

		$username = addslashes($username);
		$password = addslashes($password);

		$password = md5($password);

		$query = $this->db->query("SELECT username, password FROM user WHERE username='{$username}'");
		if ($query->num_rows > 0) {
			// $this->response(array('error' => 'duplicate user'), 200);
			header("HTTP/1.1 200 OK");
			echo json_encode(array('error' => 'duplicate'));
		} else {
			$data = array(
				'username' => $username,
				'password' => $password,
			);

			$this->db->insert('user', $data); 
			$query = $this->db->query("SELECT id FROM user WHERE username='{$username}'");
			
			//set session after user signup successfully
			if ($query->num_rows == 1) {
				$result = $query->result();
				$id = $result[0]->id;
				$this->session->set_userdata('id', $id);
				$apikey = md5($id . $username . time());
				$this->session->set_userdata('apikey', $apikey);

				$data = array(
					'key' => $apikey,
					'user_id' => $id
				);

				$this->db->insert('keys', $data);
				// $this->response(array('status' => 'success', 'id' => $id), 200);
				header("HTTP/1.1 200 OK");
				echo json_encode(array('status' => 'success', 'id' => $id, 'apikey' => $apikey));
			}
		}

		// echo 'Total Results: ' . $query->num_rows();
	}

	function logout(){
		$apikey = $this->session->userdata('apikey');
		$this->session->sess_destroy();
		if (!empty($apikey)) {
			$this->db->query("DELETE from `keys` where `key`='{$apikey}'");
		}
		// return $this->response(array('status' => 'success'), 200);
		header("HTTP/1.1 200 OK");
		echo json_encode(array('status' => 'successs'));
		// echo 'Total Results: ' . $query->num_rows();
	}

	function login_get(){
		$id = $this->session->userdata('id');
		return $id !== FALSE? $this->response(array('status' => 'true'), 200): $this->response(array('status' => 'false'), 200);
		// echo 'Total Results: ' . $query->num_rows();
	}


	function user_get()
    {
        if(!$this->get('id'))
        {
        	$this->response(NULL, 400);
        }

        // $user = $this->some_model->getSomething( $this->get('id') );
    	$users = array(
			1 => array('id' => 1, 'name' => 'Some Guy', 'email' => 'example1@example.com', 'fact' => 'Loves swimming'),
			2 => array('id' => 2, 'name' => 'Person Face', 'email' => 'example2@example.com', 'fact' => 'Has a huge face'),
			3 => array('id' => 3, 'name' => 'Scotty', 'email' => 'example3@example.com', 'fact' => 'Is a Scott!', array('hobbies' => array('fartings', 'bikes'))),
		);
		
    	$user = @$users[$this->get('id')];
    	
        if($user)
        {
            $this->response($user, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'User could not be found'), 404);
        }
    }
    
    function user_post()
    {
        //$this->some_model->updateUser( $this->get('id') );
        $message = array('id' => $this->get('id'), 'name' => $this->post('name'), 'email' => $this->post('email'), 'message' => 'ADDED!');
        
        $this->response($message, 200); // 200 being the HTTP response code
    }
    
    function user_delete()
    {
    	//$this->some_model->deletesomething( $this->get('id') );
        $message = array('id' => $this->get('id'), 'message' => 'DELETED!');
        
        $this->response($message, 200); // 200 being the HTTP response code
    }
    
    function users_get()
    {
        //$users = $this->some_model->getSomething( $this->get('limit') );
        $users = array(
			array('id' => 1, 'name' => 'Some Guy', 'email' => 'example1@example.com'),
			array('id' => 2, 'name' => 'Person Face', 'email' => 'example2@example.com'),
			3 => array('id' => 3, 'name' => 'Scotty', 'email' => 'example3@example.com', 'fact' => array('hobbies' => array('fartings', 'bikes'))),
		);
        
        if($users)
        {
            $this->response($users, 200); // 200 being the HTTP response code
        }

        else
        {
            $this->response(array('error' => 'Couldn\'t find any users!'), 404);
        }
    }


	public function send_post()
	{
		var_dump($this->request->body);
	}


	public function send_put()
	{
		var_dump($this->put('foo'));
	}
}