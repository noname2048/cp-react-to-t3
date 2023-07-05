import pytest
from fastapi.testclient import TestClient

from main import app


@pytest.fixture
def client():
    client = TestClient(app)
    return client


def test_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200


def test_daily(client: TestClient):
    response = client.get("/data?date=2023-06-15")
    assert response.status_code == 200
    assert len(response.json()["data"]) >= 1

    response = client.get("/data?date=2022-06-15")
    assert response.status_code == 200
    assert len(response.json()["data"]) == 0
