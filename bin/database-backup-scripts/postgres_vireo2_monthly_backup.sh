#!/bin/bash
# Backup storage directory 
backupfolder=/home/vireo/backups/monthly_db_vireo2

# Email settings
recipient_email="jmtroy2@illinois.edu srobbins@illinois.edu"
sender_email=jmtroy2@illinois.edu
smtp_server=express-smtp.cites.uiuc.edu
host_name=`hostname`

# Number of days to store the backup 
keep_day=365 

sqlfile=$backupfolder/vireo2-database-$(date +%Y-%m-%d_%H-%M-%S).sql
zipfile=$backupfolder/vireo2-database-$(date +%Y-%m-%d_%H-%M-%S).zip 

#create backup folder
mkdir -p $backupfolder

# Create a backup 

if pg_dump vireo2 > $sqlfile ; then
    echo 'vireo2 Sql dump created'
    echo "pg_dump of vireo2 on $host_name succeeded" | mailx -s 'vireo2 monthly backup was created!' -r $sender_email -S smtp=$smtp_server $recipient_email
else
    echo "pg_dump of vireo2 on $host_name failed" | mailx -s 'The vireo2 monthy backup FAILED!' -r $sender_email -S smtp=$smtp_server $recipient_email
    exit
fi

# Compress backup
if gzip -c $sqlfile > $zipfile; then
    echo 'The backup was successfully compressed'
    rm $sqlfile
else
    echo 'Error compressing $sqlfile on $host_name' | mailx -s 'The monthly database zip file was not created!' -r $sender_email -S smtp=$smtp_server$recipient_email
    exit
fi

# Delete old backups 
find $backupfolder -name "*.zip" -mtime +$keep_day -delete
