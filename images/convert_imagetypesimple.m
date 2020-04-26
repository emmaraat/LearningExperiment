fileNames = dir('AD*.*');
ss = size(fileNames,1);

save = 1 ; %yes = 1
path = 'C:\Users\PEAQ\Documents\PhD_York\Working from Home Folder\LearningExperimentGitlab\learningexperiment\images\F0.5ad\';

for i=1:ss
    fileNames(i).name
    im=imread(fileNames(i).name);
    
    %// Cast
    out = uint8(im);
    if save == 1
        % SAVE A PICTURE
        ima1=char(fileNames(i).name); t1=size(ima1); ima1=ima1(1:max(t1-4));
        imwrite(out,[path ima1 'new.png'],'png');

    end
end