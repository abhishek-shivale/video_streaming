import redis
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def listen_for_bull_events(queue_name):
    channels = [
        f"bull:{queue_name}:wait",
        f"bull:{queue_name}:active",
        f"bull:{queue_name}:completed",
        f"bull:{queue_name}:failed",
        f"bull:{queue_name}:delayed",
        f"bull:{queue_name}:stalled"
    ]

    pubsub = r.pubsub()
    pubsub.subscribe(channels)

    print(f"Listening for Bull queue '{queue_name}' events...")

    for message in pubsub.listen():
        if message['type'] == 'message':
            channel = message['channel'].decode()
            data = message['data']

            try:
                job_data = json.loads(data)
                print(f"Event on {channel}: {job_data}")

                if ":wait" in channel:
                    print("New job enqueued!")
                elif ":completed" in channel:
                    print("Job completed!")

            except json.JSONDecodeError:
                print(f"Non-JSON message on {channel}: {data}")

listen_for_bull_events('your-queue-name')