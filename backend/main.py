from datetime import date, datetime, timedelta
from typing import Annotated

import arrow
from fastapi import FastAPI, Body
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, BaseSettings, PostgresDsn
from sqlalchemy import create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column


class Settings(BaseSettings):
    DATABASE_URL: PostgresDsn

    class Config:
        env_file = ".env"


settings = Settings()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Base(DeclarativeBase):
    pass


class SensorData(Base):
    __tablename__ = "sensor_data"
    id: Mapped[int] = mapped_column(primary_key=True)
    temperature: Mapped[float | None]
    humidity: Mapped[float | None]
    created_at: Mapped[datetime] = mapped_column(nullable=False)


engine = create_engine(settings.DATABASE_URL, echo=True)


@app.get("/", response_class=HTMLResponse)
def root():
    return HTMLResponse("<h1>Hello World</h1>")


class SensorDataSchema(BaseModel):
    id: int
    temperature: float | None
    humidity: float | None
    created_at: datetime

    class Config:
        orm_mode = True


class SensorDataResponse(BaseModel):
    data: list[SensorDataSchema]
    count: int

    class Config:
        orm_mode = True


@app.get("/data", response_model=SensorDataResponse)
def get_data(
    query_date: date = None,
    limit: int | None = None,
):
    # kst 기준의 date가 없다면 새로 생성합니다.
    query_date: date = query_date or arrow.utcnow().to("Asia/Seoul").date()
    gte_time: datetime = arrow.get(f"{query_date}T00:00:00+09:00").datetime
    lt_time: datetime = gte_time + timedelta(days=1)

    with Session(engine) as session:
        stmt = (
            select(SensorData)
            .where(SensorData.created_at >= gte_time)
            .where(SensorData.created_at < lt_time)
            .order_by(SensorData.created_at)
            .limit(limit)
        )

        data = list(session.scalars(stmt))
    return {"data": data, "count": len(data)}


@app.get("/api/v1/data", response_model=SensorDataResponse)
def get_data_v1():
    now: datetime = datetime.utcnow()
    gte_time: datetime = now - timedelta(days=1)

    with Session(engine) as session:
        stmt = (
            select(SensorData)
            .where(SensorData.created_at >= gte_time)
            .where(SensorData.created_at < now)
            .order_by(SensorData.created_at)
            .limit(5000)
        )

        data = list(session.scalars(stmt))
    return {"data": data, "count": len(data)}


@app.get("/api/v1/data/update", response_model=SensorDataResponse)
def get_any_update(last_created_at: datetime):
    data = get_any_update_service(last_created_at=last_created_at, now=None)
    return data


def get_any_update_service(
    last_created_at: datetime,
    now: datetime | None = None,
):
    now = now or datetime.utcnow()
    if last_created_at > now:
        raise HTTPException(400, "last_created_at is wrong")
    stmt = (
        select(SensorData)
        .where(SensorData.created_at >= last_created_at)
        .order_by(SensorData.created_at)
        .limit(2000)
    )
    with Session(engine) as session:
        data = list(session.scalars(stmt))
    return data
