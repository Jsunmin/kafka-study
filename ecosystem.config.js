module.exports = {
  apps : [{
    script: './dist/src/kafka/kafka/workerCosunerGroup.js',
    watch: '.',
    instances : "3",
    exec_mode : "cluster"
  }]
}
