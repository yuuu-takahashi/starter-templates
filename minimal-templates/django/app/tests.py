from django.test import TestCase, Client


class IndexViewTests(TestCase):
    def test_index_returns_hello_world(self):
        client = Client()
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.content.decode(), "Hello, World!")
