
FROM python:3.8


RUN rm /bin/sh && ln -s /bin/bash /bin/sh


RUN apt-get update && apt-get install -y \
    curl \
    nano \
    wget \
    git \
    nginx \
    build-essential \
    gnupg \
    ca-certificates


RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs=14.* \
    && npm install -g yarn



ENV ENV_TYPE=staging
ENV MONGO_HOST=mongo
ENV MONGO_PORT=27017
ENV PYTHONPATH=/src


WORKDIR /src
COPY src/requirements.txt .


RUN pip install pip==23.0.1 setuptools==57.5.0 wheel==0.38.4 \
    && pip install --no-cache-dir -r requirements.txt


CMD ["bash"]
