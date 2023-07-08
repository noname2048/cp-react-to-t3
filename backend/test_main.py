import pytest
from fastapi.testclient import TestClient
from fastapi.exceptions import HTTPException
from datetime import datetime, timedelta

from main import app, get_any_update_service


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


def test_get_any_update_service_with_wrong_time(client: TestClient):
    future = datetime.utcnow() + timedelta(days=1)
    with pytest.raises(HTTPException):
        get_any_update_service(last_created_at=future)
