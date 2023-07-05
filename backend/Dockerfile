FROM python:3.11-bullseye AS base
ENV PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    VENV_PATH="/app/.venv" \
    PATH="$VENV_PATH/bin:$PATH"
RUN pip3 install poetry

WORKDIR /app
COPY pyproject.toml poetry.lock ./
COPY .venv ./
RUN poetry install

FROM base
EXPOSE 8000
CMD uvicorn main:app --host 0.0.0.0 --port 8000 --reload
