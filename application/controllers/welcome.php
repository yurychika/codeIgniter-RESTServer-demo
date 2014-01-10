<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Welcome extends CI_Controller {

	function __construct()
	{
		parent::__construct();
	}

	function index()
	{
		$id = $this->session->userdata('id');
		$isLoggedIn = $id !== FALSE;
		$this->load->helper('url');
		$this->load->view('index',array('isLoggedIn' => $isLoggedIn? 1 : 0));
	}
}

/* End of file welcome.php */
/* Location: ./system/application/controllers/welcome.php */