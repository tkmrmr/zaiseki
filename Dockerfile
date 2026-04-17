FROM debian:bookworm-slim AS builder

ARG PYTHON_VERSION=3.10.12

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates wget build-essential libbz2-dev libdb-dev \
    libreadline-dev libffi-dev libgdbm-dev liblzma-dev \
    libncursesw5-dev libsqlite3-dev libssl-dev \
    zlib1g-dev uuid-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /tmp

RUN wget https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tar.xz \
    && tar xJf Python-${PYTHON_VERSION}.tar.xz \
    && cd Python-${PYTHON_VERSION} \
    && ./configure \
    && make -j"$(nproc)" \
    && make install \
    && cd .. && rm -rf Python-${PYTHON_VERSION}*

FROM httpd:2.4-bookworm

ARG PYTHON_VERSION=3.10

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates libbz2-1.0 libdb5.3 \
    libreadline8 libffi8 libgdbm6 liblzma5 \
    libncursesw6 libsqlite3-0 libssl3 \
    zlib1g libuuid1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/local/bin/python3 /usr/local/bin/
COPY --from=builder /usr/local/bin/python${PYTHON_VERSION} /usr/local/bin/
COPY --from=builder /usr/local/lib/python${PYTHON_VERSION} /usr/local/lib/python${PYTHON_VERSION}
COPY --from=builder /usr/local/bin/pip3 /usr/local/bin/
COPY --from=builder /usr/local/bin/pip${PYTHON_VERSION} /usr/local/bin/

RUN python3 -m pip install --no-cache-dir --break-system-packages requests