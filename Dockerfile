#------------------------------------------------------------------------------ 
#-------------------------------------------------------------------------------

FROM mstev0du/supervisor_node:latest

RUN npm install dotenv --save

# add app directory
ADD . /c9auth/

#----------------------------------------------------------------------------
# Supervisor Configuration
#----------------------------------------------------------------------------

ADD cloud9_auth.conf /etc/supervisor/conf.d/

EXPOSE 3000
EXPOSE 27017

# Start supervisor, define default command.
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]
